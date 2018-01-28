import { BroadcastSlot } from '../../types/abemagraph';
import { Channel, Slot } from '../../types/abema';

export interface StoreBroadcast {
    slots: BroadcastSlot[];
    updated: number;
    isFetching: boolean;
    isFailed: boolean;
}

export interface StoreApp {
    channels: Channel[];
    slot?: Slot;
}


export interface Store {
    app: StoreApp;
    broadcast: StoreBroadcast;
}