import * as moment from 'moment';
import { Client } from 'elasticsearch';
import * as _ from 'lodash';

import Config from '../config';
import { Timetable, Slot } from '../types/abema';
import { app as appLogger } from '../logger';
import { api } from '../utils/abema';

export const downloadTimetable = async (): Promise<Timetable> => {
    const timetable: Timetable = {
        channels: [],
        channelSchedules: []
    };
    let startDate = moment().subtract(4, 'day').startOf('day');

    const slots: { [channelId: string]: { [slotId: string]: Slot } } = {};
    while (true) {
        appLogger.debug('Downloading timetable', startDate.format('YYYYMMDD'));
        const response = await api<Timetable>('media', 'GET', {
            dateFrom: startDate.format('YYYYMMDD'),
            dateTo: (startDate = startDate.add(5, 'days')).format('YYYYMMDD')
        });
        timetable.channels.push(...response.channels.filter(channel => !timetable.channels.some(ch => ch.id === channel.id)));
        if (response.channelSchedules.length === 0 || !response.channelSchedules.some(channel => channel.slots.length > 0)) break;
        for (const schedules of response.channelSchedules) {
            if (!slots[schedules.channelId]) slots[schedules.channelId] = {};
            for (const slot of schedules.slots)
                slots[schedules.channelId][slot.id] = slot;
        }
    }
    timetable.channelSchedules = _.map(slots, (chSlots, channelId) => ({
        channelId,
        date: moment().format('YYYYMMDD'),
        slots: Object.values(chSlots)
    }));

    const totalSlots = Object.keys(slots).reduce((count, channelId) => count + Object.keys(slots[channelId]).length, 0);
    appLogger.info('Timetable information', 'total:', totalSlots, 'channels:', timetable.channels.length);
    return timetable;
};

export const normalizePerson = (arr: string[]) =>
    _.chain(arr).flatMap(str => str.split(/[／\/]/))
        .flatMap(str => str.split(/[、,]/))
        .map(str => str.replace(/^.*[:：]/, '').replace(/[\(【].*[\)】]/g, '').trim())
        .flatMap(str => str.split(/・/))
        .filter(str => !str.match(/(その)?他$/))
        .value();

export const convertSlotToES = (slot: Slot) => ({
    channel: slot.channelId,
    title: slot.title,
    content: slot.content,
    series: slot.programs[0].series ? slot.programs[0].series.id : '',
    start: moment.unix(slot.startAt).format(),
    end: moment.unix(slot.endAt).format(),
    hashtag: slot.hashtag || '',
    flags: [...Object.keys(slot.flags), ...Object.keys(slot.mark)],
    group: slot.slotGroup ? slot.slotGroup.id : '',
    crews: normalizePerson(slot.programs[0].credit.crews || []),
    casts: normalizePerson(slot.programs[0].credit.casts || [])
});

export const storeTimetableToES = async (es: Client, slots: Slot[]) => {
    for (let i = 0; i < slots.length; i += 1000) {
        appLogger.trace('Storing slots to ES', 'total:', slots.length, 'index:', i);
        await es.bulk({
            // tslint:disable-next-line:no-any
            body: _.flatMap(slots.slice(i, i + 1000), slot => ([
                { update: { _index: Config.elasticsearch.index, _type: Config.elasticsearch.type, _id: slot.id } },
                { doc: convertSlotToES(slot), doc_as_upsert: true }
            ]))
        });
    }
    appLogger.debug('All slots are stored to ES');
};