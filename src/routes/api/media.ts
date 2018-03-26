import { Request } from 'express';
import { NotFound } from 'http-errors';
import * as _ from 'lodash';

import { Channel, Slot, Timetable } from '../../types/abema';
import { collector } from '../../collector';
import { api } from './index';

export const channels = api.get('/channels', async (): Promise<Channel[]> => {
    const cursor = await collector.channelsDb.find();
    return (await cursor.toArray()).map(channel => _.merge(_.pick(channel, 'id', 'order'), { name: channel.name.replace(/チャンネル$/, '') }));
});

api.get('/timetable', async (): Promise<Timetable | null> => {
    return collector.timetable || null;
});

export const getSlot = api.get('/slots/:slotId', async (slotId: string): Promise<Slot | null> => {
    const slots = await collector.findSlot(slotId);
    if (slots.length !== 1)
        throw new NotFound('Slot not found');
    return slots[0];
}, ({ slotId }) => slotId);