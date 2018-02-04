import { BroadcastSlot, AllLog } from '../../types/abemagraph';
import { Channel, Slot } from '../../types/abema';
import { Moment } from 'moment';

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
    logs?: Array<[number, number, number]>;
    isSlotFailed: boolean;
    isLogsFailed: boolean;
}

export interface StoreAll {
    isAllFailed: boolean;
    date: Moment;
    all: AllLog | undefined;
}

export interface Store {
    app: StoreApp;
    broadcast: StoreBroadcast;
    slot: StoreSlot;
    all: StoreAll;
}