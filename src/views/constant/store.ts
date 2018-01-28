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
}

export interface StoreSlot {
    slot?: Slot;
    isFailed: boolean;
}

export interface Store {
    app: StoreApp;
    broadcast: StoreBroadcast;
    slot: StoreSlot;
}