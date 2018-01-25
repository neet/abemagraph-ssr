import { Client } from 'elasticsearch';
import { Db, Collection } from 'mongodb';
import { writeFile, readFile, exists } from 'async-file';
import * as moment from 'moment';
import * as _ from 'lodash';

import Config from '../config';
import { downloadTimetable, storeTimetableToES } from './timetable';
import { app as appLogger } from '../logger';
import { Slot, Program, Channel, Timetable } from '../types/abema';
import { getSlotAudience } from './audience';
import { Log, All } from '../types/abemagraph';
import { sleep } from '../utils/sleep';
import { purgeId } from '../utils/purge-id';

export class Collector {
    slotsDb: Collection<Slot & { programs: string[] }>;
    programsDb: Collection<Program>;
    logsDb: Collection<Log>;
    channelsDb: Collection<Channel>;
    allDb: Collection<All>;
    timetable?: Timetable;

    private cancelPromise: Promise<void> | null = null;
    private cancel: Function | null = null;
    private promises: Array<Promise<void>> = [];
    constructor(public db: Db, public es: Client) {
        this.slotsDb = db.collection('slots');
        this.programsDb = db.collection('programs');
        this.logsDb = db.collection('logs');
        this.channelsDb = db.collection('channels');
        this.allDb = db.collection('all');
    }

    async updateFullTimetable() {
        this.timetable = await downloadTimetable();

        await writeFile(Config.cache.timetable, JSON.stringify(this.timetable), { encoding: 'utf8' });
        appLogger.debug('Saved timetable file');

        const slots = this.slots;
        await this.channelsDb.insertMany(this.timetable.channels.map(channel => ({ ...channel, _id: channel.id }))).catch(() => undefined);
        await this.programsDb.insertMany(_.uniqBy(_.flatMap(slots, s => s.programs), p => p.id).map(program => ({ ...program, _id: program.id }))).catch(() => undefined);
        await this.slotsDb.bulkWrite(slots.map(slot => ({
            replaceOne: {
                filter: { _id: slot.id },
                replacement: {
                    ...slot,
                    _id: slot.id,
                    programs: slot.programs.map(p => p.id)
                },
                upsert: true
            }
        })));
        appLogger.debug('MongoDB updated');
        await storeTimetableToES(this.es, slots);
    }

    async loadTimetableFromFile() {
        if (await exists(Config.cache.timetable))
            this.timetable = JSON.parse(await readFile(Config.cache.timetable, { encoding: 'utf8' }));
    }

    get slots() {
        if (!this.timetable) return [];
        return _.flatMap(this.timetable.channelSchedules, c => c.slots);
    }

    get currentSlots() {
        if (!this.timetable) return [];
        const now = Date.now() / 1000;
        return this.slots.filter(slot => slot.startAt <= now && slot.endAt >= now);
    }

    async collectSlotLog() {
        const slots = this.currentSlots;
        const audiences = await getSlotAudience(...slots.map(slot => slot.id));
        const now = Math.floor(Date.now() / 1000);
        const all: All = { c: 0, v: 0, ch: {}, t: now, date: moment().format('YYYYMMDD') };
        const pastLogs = await this.findLogs(...audiences.map(a => a.slotId));
        for (const audience of audiences) {
            if (pastLogs[audience.slotId] && Object.keys(pastLogs[audience.slotId].log).length >= 2) {
                const past = pastLogs[audience.slotId];
                const lastKey = Object.keys(past.log).map(v => Number(v)).sort((a, b) => b - a)[0];
                const commentInc = Math.floor((audience.commentCount - past.log[`${lastKey}`].c) / (now - lastKey) * 60);
                const viewInc = Math.floor((audience.viewCount - past.log[`${lastKey}`].v) / (now - lastKey) * 60);
                if (commentInc > 0 && viewInc > 0) {
                    all.ch[audience.channelId] = [commentInc, viewInc];
                    all.c += commentInc;
                    all.v += viewInc;
                }
            } /*else {
                const slot = slots.find(s => s.id === audience.slotId);
                if (slot && now - slot.startAt > 60) {
                    const commentInc = Math.floor(audience.commentCount / (now - slot.startAt) * 60);
                    const viewInc = Math.floor(audience.viewCount / (now - slot.startAt) * 60);
                    all.ch[audience.channelId] = [commentInc, viewInc];
                    all.c += commentInc;
                    all.v += viewInc;
                }
            }*/
            await this.logsDb.updateOne({ _id: audience.slotId }, {
                '$set': {
                    [`log.${now}`]: {
                        c: audience.commentCount,
                        v: audience.viewCount
                    }
                }
            }, { upsert: true });
        }

        if (Object.keys(all.ch).length > 0)
            await this.allDb.insertOne(all);

        appLogger.debug('Slot status collected');
    }

    get channels() {
        if (this.timetable)
            return this.timetable.channels;
        else
            return null;
    }

    async getChannel(...names: string[]): Promise<Channel[]> {
        const cursor = await this.channelsDb.find({ $or: names.map(name => ({ _id: name })) });
        return (await cursor.toArray()).map(purgeId);
    }

    async findLogs(...slotIds: string[]): Promise<{ [slot: string]: Log }> {
        const cursor = await this.logsDb.find({ $or: slotIds.map(_id => ({ _id })) });
        const result = await cursor.toArray();
        return result.reduce((list: { [slot: string]: Log }, item) => ({ ...list, [item._id]: item }), {});
    }

    async findSlot(...slotIds: string[]): Promise<Slot[]> {
        const slotCursor = await this.slotsDb.find({ $or: slotIds.map(slotId => ({ _id: slotId })) });
        const slots = (await slotCursor.toArray()).map(purgeId);
        if (slots.length === 0) return [];
        const prorgamsCursor = await this.programsDb.find({ $or: _.flatMap(slots, slot => slot.programs).map(pgId => ({ _id: pgId })) });
        const programs = (await prorgamsCursor.toArray()).map(purgeId);
        return slots.map(slot => ({
            ...slot,
            programs: slot.programs.map((pgId: string) => programs.find(pg => pg.id === pgId)).filter((pg: Program): pg is Program => !!pg)
        }));
    }

    startSchedule() {
        if (this.cancel) return;
        this.cancelPromise = new Promise(resolve => this.cancel = () => resolve());

        const timetableTask = async () => {
            while (this.cancel && this.cancelPromise) {
                await this.updateFullTimetable();
                appLogger.debug('Timetable updater', 'OK');
                await Promise.race([this.cancelPromise, sleep(Config.abema.timetableUpdateInterval * 1000)]);
            }
        };
        const collectStatsTask = async () => {
            while (this.cancel && this.cancelPromise) {
                await this.collectSlotLog();
                appLogger.debug('Collector', 'OK');
                await Promise.race([this.cancelPromise, sleep(60 * 1000)]);
            }
        };
        this.promises = [timetableTask(), collectStatsTask()];
    }

    async stopSchedule() {
        if (!this.cancel) return;
        appLogger.info('Scheduler stopping');
        this.cancel();
        await Promise.all(this.promises);
        appLogger.info('Scheduler stopped');
    }
}