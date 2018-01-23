import { BroadcastSlot } from '../../types/abemagraph';

export interface StoreBroadcast {
    broadcastSlots: BroadcastSlot[];
    broadcastSlotUpdated: number;
}

export interface Store {
    broadcast: StoreBroadcast;
}