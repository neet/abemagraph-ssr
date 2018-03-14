import { Request } from 'express';
import { NotFound } from 'http-errors';

import { Channel, Slot } from '../../types/abema';
import { collector } from '../../collector';
import { api } from './index';

export const channels = async (): Promise<Channel[]> => {
    const cursor = await collector.channelsDb.find();
    return (await cursor.toArray()).map(channel => ({ id: channel.id, name: channel.name.replace(/チャンネル$/, ''), order: channel.order }));
};
api.get('/channels', channels);

export const getSlot = async (slotId: string): Promise<Slot | null> => {
    const slots = await collector.findSlot(slotId);
    if (slots.length !== 1)
        throw new NotFound('Slot not found');
    return slots[0];
};
api.get('/slots/:slotId', getSlot, ({ slotId }) => slotId);