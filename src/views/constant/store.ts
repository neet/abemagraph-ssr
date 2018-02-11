import { BroadcastSlot, AllLogCompressed } from '../../types/abemagraph';
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
    slotStatus: false | number;
    logsStatus: false | number;
}

export interface StoreAll {
    allStatus: false | number;
    date: Moment;
    all: AllLogCompressed | undefined;
}

export interface Store {
    app: StoreApp;
    broadcast: StoreBroadcast;
    slot: StoreSlot;
    all: StoreAll;
}