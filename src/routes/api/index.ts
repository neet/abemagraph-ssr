import { Router, Request, Response } from 'express';
import { Collector } from '../../collector';

import * as _ from 'lodash';
import { Stats, BroadcastSlot } from '../../types/abemagraph';
import { Channel, Slot } from '../../types/abema';

const router = Router();

export const broadcast = async (req: Request): Promise<BroadcastSlot[]> => {
    const collector = req.app.get('collector') as Collector;
    const slots = collector.currentSlots;
    const logs = await collector.findLogs(...slots.map(s => s.id));
    const lastLogs: { [slot: string]: Stats } = Object.keys(logs).reduce((obj, key) => {
        const lastKey = _.last(Object.keys(logs[key].log));
        if (lastKey)
            return {
                ...obj,
                [key]: {
                    comment: logs[key].log[lastKey].c || 0,
                    view: logs[key].log[lastKey].v || 0,
                    updated: Number(lastKey)
                }
            };
        else
            return obj;
    }, {});
    return slots.map(slot => ({
        id: slot.id,
        channelId: slot.channelId,
        title: slot.title,
        startAt: slot.startAt,
        duration: slot.endAt - slot.startAt,
        mark: [
            ...Object.keys(slot.mark).filter(key => slot.mark[key]),
            ...Object.keys(slot.flags).filter(key => slot.flags[key])
        ],
        stats: lastLogs[slot.id] || null
    }));
};

export const broadcastChannels = (req: Request): Channel[] => {
    const collector = req.app.get('collector') as Collector;
    const channels = collector.channels;
    if (channels)
        return channels.map(channel => ({ id: channel.id, name: channel.name.replace(/チャンネル$/, ''), order: channel.order })) || [];
    else
        return [];
};

export const channels = async (req: Request): Promise<Channel[]> => {
    const collector = req.app.get('collector') as Collector;
    const cursor = await collector.channelsDb.find();
    return (await cursor.toArray()).map(channel => ({ id: channel.id, name: channel.name.replace(/チャンネル$/, ''), order: channel.order }));
};

export const getSlot = async (req: Request, slotId: string): Promise<Slot | null> => {
    const collector = req.app.get('collector') as Collector;
    const slots = await collector.findSlot(slotId);
    return slots.length === 1 ? slots[0] : null;
};

export const slotLog = async (req: Request, slotId: string): Promise<number[][] | null> => {
    const collector = req.app.get('collector') as Collector;
    const slots = await collector.findSlot(slotId);
    if(slots.length !== 1) return null;
    const log = await collector.logsDb.findOne({ _id: slotId });
    if (log) {
        const keys = Object.keys(log.log).map(k => Number(k)).sort();
        if (keys.length === 0) return [];
        return keys.map(ts => [ts - slots[0].startAt, log.log[ts.toString()].v, log.log[ts.toString()].c]);
    } else {
        return [];
    }
};

router.get('/broadcast', async (req, res, next) => {
    res.json(await broadcast(req)).end();
});

router.get('/broadcast/channels', async (req, res, next) => {
    res.json(broadcastChannels(req)).end();
});

router.get('/channels', async (req, res, next) => {
    res.json(await channels(req)).end();
});

router.get('/slots/:slotId', async (req, res, next) => {
    const slot = await getSlot(req, req.params.slotId);
    if (slot)
        res.json(slot).end();
    else
        res.status(404).end('404 not found');
});

router.get('/logs/:slotId', async (req, res, next) => {
    const log = await slotLog(req, req.params.slotId);
    if (log)
        res.json(log).end();
    else
        res.status(404).end('404 not found');
});

export default router;