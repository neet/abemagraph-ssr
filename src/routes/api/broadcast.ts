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
    const lastLogs = _.chain(logs).mapValues(({ log }) => {
        const lastKey = _.last(Object.keys(log));
        return lastKey ? {
            comment: log[lastKey].c || 0,
            view: log[lastKey].v || 0,
            updated: Number(lastKey)
        } : undefined;
    }).pickBy(_.isObject).value() as { [slot: string]: Stats };
    return slots.map(slot => ({
        id: slot.id,
        channelId: slot.channelId,
        title: slot.title,
        startAt: slot.startAt,
        duration: slot.endAt - slot.startAt,
        mark: [
            ...Object.keys(slot.mark),
            ...Object.keys(slot.flags)
        ],
        stats: lastLogs[slot.id] || null
    }));
}, undefined, 60);

export const broadcastChannels = api.get('/broadcast/channels', async (): Promise<Channel[]> => {
    const channels = collector.channels;
    if (channels)
        return channels.map(channel => _.merge(_.pick(channel, 'id', 'order'), { name: channel.name.replace(/チャンネル$/, '') })) || [];
    else
        throw new ServiceUnavailable('No channels, server did not start correctly');
});