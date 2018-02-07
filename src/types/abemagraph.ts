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