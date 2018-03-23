import { BroadcastSlot, AllLogCompressed, SearchResult, BroadcastSortType } from '../../types/abemagraph';
import { Channel, Slot } from '../../types/abema';
import { Moment } from 'moment';

export interface StoreBroadcast {
    slots: BroadcastSlot[];
    sortType: BroadcastSortType;
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
    date: Moment | string; // SSR時のinitialStateはstring
    all: AllLogCompressed | undefined;
}

export interface StoreSearch {
    status: false | number;
    query: string;
    page: number;
    result?: SearchResult;
}

export interface Store {
    app: StoreApp;
    broadcast: StoreBroadcast;
    slot: StoreSlot;
    all: StoreAll;
    search: StoreSearch;
}