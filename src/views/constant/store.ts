import { BroadcastSlot } from '../../types/abemagraph';

export interface StoreBroadcast {
    broadcastSlots: BroadcastSlot[];
    broadcastSlotUpdated: number;
}

export interface StoreApp {
    currentTs: number;
}


export interface Store {
    app: StoreApp;
    broadcast: StoreBroadcast;
}