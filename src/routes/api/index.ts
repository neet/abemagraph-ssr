import { Router, Request, Response } from 'express';
import * as moment from 'moment';
import { parse } from 'search-query-parser';
import { Collector } from '../../collector';

import * as _ from 'lodash';
import { Stats, BroadcastSlot, AllLogCompressed } from '../../types/abemagraph';
import { Channel, Slot } from '../../types/abema';

const router = Router();

export const broadcast = async (req: Request): Promise<BroadcastSlot[]> => {
    const collector = req.app.get('collector') as Collector;
    const slots = collector.currentSlots;
    const logs = await collector.findLogs(...slots.map(s => s.id));
    const lastLogs: { [slot: string]: Stats } = Object.keys(logs).reduce((obj, key) => {
        const lastKey = _.last(Object.keys(logs[key].log));
        if (lastKey)
            return {
                ...obj,
                [key]: {
                    comment: logs[key].log[lastKey].c || 0,
                    view: logs[key].log[lastKey].v || 0,
                    updated: Number(lastKey)
                }
            };
        else
            return obj;
    }, {});
    return slots.map(slot => ({
        id: slot.id,
        channelId: slot.channelId,
        title: slot.title,
        startAt: slot.startAt,
        duration: slot.endAt - slot.startAt,
        mark: [
            ...Object.keys(slot.mark).filter(key => slot.mark[key]),
            ...Object.keys(slot.flags).filter(key => slot.flags[key])
        ],
        stats: lastLogs[slot.id] || null
    }));
};

export const broadcastChannels = (req: Request): Channel[] => {
    const collector = req.app.get('collector') as Collector;
    const channels = collector.channels;
    if (channels)
        return channels.map(channel => ({ id: channel.id, name: channel.name.replace(/チャンネル$/, ''), order: channel.order })) || [];
    else
        return [];
};

export const channels = async (req: Request): Promise<Channel[]> => {
    const collector = req.app.get('collector') as Collector;
    const cursor = await collector.channelsDb.find();
    return (await cursor.toArray()).map(channel => ({ id: channel.id, name: channel.name.replace(/チャンネル$/, ''), order: channel.order }));
};

export const getSlot = async (req: Request, slotId: string): Promise<Slot | null> => {
    const collector = req.app.get('collector') as Collector;
    const slots = await collector.findSlot(slotId);
    return slots.length === 1 ? slots[0] : null;
};

export const slotLog = async (req: Request, slotId: string): Promise<number[][] | null> => {
    const collector = req.app.get('collector') as Collector;
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

export const allLog = async (req: Request, date: string) => {
    if (!date.match(/^\d{8}$/)) return null;
    const collector = req.app.get('collector') as Collector;
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

export const search = async (req: Request, { query, page }: { query: string, page: number }) => {
    if (typeof query !== 'string' || query.length > 1024 || query.length <= 0) return null;
    if (isNaN(page)) return null;
    const collector = req.app.get('collector') as Collector;
    const queryOptions = {
        keywords: ['channel', 'flag', 'since', 'until', 'sort', 'group', 'series']
    };
    const queryParsed = parse(query, queryOptions);
    const must: Array<{}> = [];
    const sort: Array<{}> = ['_score'];
    if (typeof queryParsed === 'string') {
        must.push({
            simple_query_string: {
                fields: ['title', 'content', 'hashtag', 'crews', 'casts'],
                query: queryParsed,
                default_operator: 'and'
            }
        });
    } else {
        if (queryParsed.text) {
            must.push({
                simple_query_string: {
                    fields: ['title', 'content', 'hashtag', 'crews', 'casts'],
                    query: queryParsed.text,
                    default_operator: 'and'
                }
            });
        }
        if (queryParsed.channel) {
            const channel = _.flatMap([queryParsed.channel], m => m as string).filter(m => m.match(/^[a-z0-9\-]{1,20}$/));
            must.push({ terms: { channel } });
        }
        if (queryParsed.series) {
            const series = _.flatMap([queryParsed.series], m => m as string).filter(m => m.match(/^[a-z0-9\-_]{1,20}$/));
            must.push({ terms: { series } });
        }
        if (queryParsed.group) {
            const group = _.flatMap([queryParsed.group], m => m as string).filter(m => m.match(/^[a-zA-Z0-9]{1,20}$/));
            must.push({ terms: { group } });
        }
        const range: { from?: string, to?: string } = {};
        if (typeof queryParsed.since === 'string') {
            const since = queryParsed.since === 'now' ? moment() : moment(queryParsed.since);
            if (since.isValid())
                range.from = since.format();
        }
        if (typeof queryParsed.until === 'string') {
            const until = queryParsed.until === 'now' ? moment() : moment(queryParsed.until);
            if (until.isValid())
                range.to = until.format();
        }
        if (range.from || range.to) {
            must.push({ range: { start: range } });
        }
        if (typeof queryParsed.sort === 'string' && queryParsed.sort.match(/^(start|title)\/(desc|asc)$/)) {
            const [key, order] = queryParsed.sort.split('/');
            sort.unshift({ [key]: { order } });
        }
        if (queryParsed.flag) {
            const flags = _.compact(_.flatMap([queryParsed.flag], m => m as string))
                .filter(m => m.match(/^(first|last|live|bingeWatching|timeshiftFree|timeshift|drm|recommendation)$/i))
                .map(m => m.toLowerCase().replace('bingewatching', 'bingeWatching').replace('timeshiftfree', 'timeshiftFree'));
            must.push({ terms: { flags } });
        }
    }
    const esQuery = {
        query: { bool: { must } },
        size: 50,
        from: page * 50,
        highlight: {
            pre_tags: ['<mark search>'],
            post_tags: ['</mark>'],
            fields: {
                'title': {
                    fragment_size: 500,
                    number_of_fragments: 1,
                    no_match_size: 500,
                    encoder: 'html'
                },
                'content': {
                    fragment_size: 500,
                    number_of_fragments: 1,
                    no_match_size: 500,
                    encoder: 'html',
                },
                'hashtag': {
                    fragment_size: 100,
                    number_of_fragments: 1,
                    no_match_size: 0,
                    encoder: 'html',
                }
            },
        },
        sort,
        timeout: 10000
    };
    const esResult = await collector.search(esQuery);
    if (esResult.timed_out) return null;
    return {
        total: esResult.hits.total,
        took: esResult.took,
        hits: esResult.hits.hits.map(item => ({
            title: item.highlight.title ? item.highlight.title[0] : item._source.title,
            channelId: item._source.channel,
            id: item._id,
            content: item.highlight.content ? item.highlight.content[0] : item._source.content,
            hashtag: item.highlight.hashtag ? item.highlight.hashtag[0] : item._source.hashtag,
            flags: item._source.flags,
            start: moment(item._source.start),
            end: moment(item._source.end),
            score: item._score
        }))
    };
};

router.get('/broadcast', async (req, res, next) => {
    res.json(await broadcast(req)).end();
});

router.get('/broadcast/channels', async (req, res, next) => {
    res.json(broadcastChannels(req)).end();
});

router.get('/channels', async (req, res, next) => {
    res.json(await channels(req)).end();
});

router.get('/slots/:slotId', async (req, res, next) => {
    const slot = await getSlot(req, req.params.slotId);
    if (slot)
        res.json(slot).end();
    else
        res.status(404).end('404 not found');
});

router.get('/logs/:slotId', async (req, res, next) => {
    const log = await slotLog(req, req.params.slotId);
    if (log)
        res.json(log).end();
    else
        res.status(404).end('404 not found');
});

router.get('/all/:date', async (req, res, next) => {
    const log = await allLog(req, req.params.date);
    if (log)
        res.json(log).end();
    else
        res.status(404).end('404 not found');
});

router.get('/search', async (req, res, next) => {
    const result = await search(req, {
        query: req.query.q || '',
        page: Number(req.query.page || 0)
    });
    if (result)
        res.json(result).end();
    else
        res.status(400).end('bad request');
});

router.use((req, res, next) => res.status(404).end('404 not found'));
export default router;