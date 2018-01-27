import { BroadcastSlot } from '../../types/abemagraph';
import { Channel, Slot } from '../../types/abema';

export interface StoreBroadcast {
    broadcastSlots: BroadcastSlot[];
    broadcastSlotUpdated: number;
}

export interface StoreApp {
    channels: Channel[];
    slot: Slot | null;
}


export interface Store {
    app: StoreApp;
    broadcast: StoreBroadcast;
}