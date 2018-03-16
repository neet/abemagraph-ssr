import * as _ from 'lodash';
import { Request } from 'express';
import { NotFound, BadRequest } from 'http-errors';

import { collector } from '../../collector';
import { api } from './index';

export const slotLog = api.get('/logs/:slotId', async (slotId: string): Promise<number[][] | null> => {
    const slots = await collector.findSlot(slotId);
    if (slots.length !== 1) throw new NotFound('Slot not found');
    const log = await collector.logsDb.findOne({ _id: slotId });
    if (log) {
        const keys = Object.keys(log.log).map(k => Number(k)).sort();
        if (keys.length === 0) throw new NotFound('No log items');
        return keys.map(ts => [ts - slots[0].startAt, log.log[ts.toString()].v, log.log[ts.toString()].c]);
    } else {
        throw new NotFound('Log not found');
    }
}, ({ slotId }) => slotId, 15);

export const allLog = api.get('/all/:date', async (date: string) => {
    if (!date.match(/^\d{8}$/)) throw new BadRequest('Invalid date');
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
        throw new NotFound('No log items');
    }
}, ({ date }) => date, 15);