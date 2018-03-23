import * as moment from 'moment';
import { SortType } from '../views/constant/const';

export interface Log {
    log: {
        [time: string]: {
            c: number;
            v: number;
        }
    };
    _id: string;
}

export interface All {
    date: string;
    t: number;
    c: number;
    v: number;
    ch: { [channel: string]: number[] };
}

export type Stats = { comment: number, view: number, updated: number };

export type BroadcastSortType = 'v' | 'c' | 'vpm' | 'cpm' | 'ch';
export interface BroadcastSlot {
    id: string;
    channelId: string;
    title: string;
    startAt: number;
    duration: number;
    mark: string[];
    stats?: Stats;
}

export type AllLogCompressed = [number, string[], Array<[number, number, number, Array<[number, number] | 0>]>];
export type AllLog = Array<{
    time: number,
    view: number,
    comment: number,
    channels: {
        [channel: string]: {
            view: number,
            comment: number
        }
    }
}>;

export type ESData = {
    casts: string[],
    channel: string,
    content: string,
    crews: string[],
    end: string,
    flags: string[],
    group?: string,
    hashtag?: string,
    series: string,
    start: string,
    title: string
};

export interface ParsedQuery {
    keyword: string;
    channel: string[];
    flag: string[];
    sort?: SortType;
    since?: [string, moment.Moment];
    until?: [string, moment.Moment];
    group: string[];
    series: string[];
}

export interface SearchResultItem {
    title: string;
    channelId: string;
    id: string;
    content: string;
    hashtag: string;
    flags: string[];
    start: string;
    end: string;
    score: number;
}

export interface SearchResult {
    total: number;
    took: number;
    hits: SearchResultItem[];
}