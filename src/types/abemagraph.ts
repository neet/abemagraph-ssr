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

export interface BroadcastSlot {
    id: string;
    channelId: string;
    title: string;
    startAt: number;
    duration: number;
    mark: string[];
    stats?: Stats;
}