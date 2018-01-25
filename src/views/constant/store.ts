import { BroadcastSlot } from '../../types/abemagraph';
import { Channel } from '../../types/abema';

export interface StoreBroadcast {
    broadcastSlots: BroadcastSlot[];
    broadcastSlotUpdated: number;
}

export interface StoreApp {
    channels: Channel[];
}


export interface Store {
    app: StoreApp;
    broadcast: StoreBroadcast;
}