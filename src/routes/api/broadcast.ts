import * as _ from 'lodash';
import { Request } from 'express';
import { ServiceUnavailable } from 'http-errors';

import { BroadcastSlot, Stats } from '../../types/abemagraph';
import { collector } from '../../collector';
import { Channel } from '../../types/abema';
import { api } from './index';

export const broadcast = api.get('/broadcast', async (): Promise<BroadcastSlot[]> => {
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
}, undefined, 60);

export const broadcastChannels = api.get('/broadcast/channels', async (): Promise<Channel[]> => {
    const channels = collector.channels;
    if (channels)
        return channels.map(channel => ({ id: channel.id, name: channel.name.replace(/チャンネル$/, ''), order: channel.order })) || [];
    else
        throw new ServiceUnavailable('No channels, server did not start correctly');
});