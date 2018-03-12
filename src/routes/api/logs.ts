import * as _ from 'lodash';
import { Request } from 'express';

import { collector } from '../../collector';
import { api } from './index';

export const slotLog = async (slotId: string): Promise<number[][] | null> => {
    const slots = await collector.findSlot(slotId);
    if (slots.length !== 1) return null;
    const log = await collector.logsDb.findOne({ _id: slotId });
    if (log) {
        const keys = Object.keys(log.log).map(k => Number(k)).sort();
        if (keys.length === 0) return [];
        return keys.map(ts => [ts - slots[0].startAt, log.log[ts.toString()].v, log.log[ts.toString()].c]);
    } else {
        return [];
    }
};
api.get('/logs/:slotId', slotLog, ({ slotId }) => slotId);

export const allLog = async (date: string) => {
    if (!date.match(/^\d{8}$/)) return null;
    const allCursor = await collector.allDb.find({ date });
    if (await allCursor.hasNext()) {
        const allArr = await allCursor.toArray();
        const channels = _.uniq(_.flatMap(allArr, item => Object.keys(item.ch))).sort();
        const channelDict = channels.reduce((p, k, i) => {
            p[k] = i;
            return p;
        }, {});
        const min = allArr[0].t;
        return [min, channels, allArr.map(item => ([
            item.t - min,
            item.c,
            item.v,
            Object.keys(item.ch).reduce((arr, ch) => {
                arr[channelDict[ch]] = item.ch[ch];
                return arr;
            }, new Array(channels.length).fill(0))
        ]))];
    } else {
        return null;
    }
};
api.get('/all/:date', allLog, ({ date }) => date);