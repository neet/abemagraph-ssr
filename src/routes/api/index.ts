import { Router, Request, Response } from 'express';
import { Collector } from '../../collector';

import * as _ from 'lodash';
import { Stats, BroadcastSlot } from '../../types/abemagraph';
import { Channel } from '../../types/abema';

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
        return channels.map(channel => ({ id: channel.id, name: channel.name.replace(/チャンネル$/, '') })) || [];
    else
        return [];
};

router.get('/broadcast', async (req, res, next) => {
    res.json(await broadcast(req)).end();
});

router.get('/broadcast/channels', async (req, res, next) => {
    res.json(broadcastChannels(req)).end();
});

export default router;