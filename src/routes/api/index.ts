import { Router, Request, Response } from 'express';
import * as LRU from 'lru-cache';
import { broadcast, broadcastChannels } from './broadcast';
import { channels, getSlot } from './media';
import { slotLog, allLog } from './logs';
import { search } from './search';

const router = Router();

const cache = LRU(1000);
const apize = (method: 'get' | 'post') => <P, R, P1, P2>(path: string, func: (param?: P) => Promise<R>, transform?: (param: P1, query: P2) => P, cacheExpires = 3600): (param?: P) => Promise<R> => {
    router[method](path, (req, res, next) => {
        const param = transform ? transform(req.params, req.query) : undefined;
        const cacheKey = JSON.stringify({ param: param || null, path });
        if (cacheKey && cache.has(cacheKey)) {
            if (process.env.NODE_ENV !== 'production')
                res.setHeader('X-Cache-Status', 'HIT');
            res.json(cache.get(cacheKey)).end();
            return;
        }
        func(param).then(result => {
            if (cacheExpires > 0)
                cache.set(cacheKey, result, cacheExpires * 1000);
            res.json(result).end();
        }).catch(err => {
            if (err.expose)
                res.status(err.statusCode).end(err.message);
            else
                res.status(400).end();
        });
    });
    return async (param: P): Promise<R> => {
        const cacheKey = JSON.stringify({ param: param || null, path });
        if (cacheKey && cache.has(cacheKey)) {
            return cache.get(cacheKey) as R;
        }
        const result = func(param);
        if (cacheExpires > 0)
            cache.set(cacheKey, result, cacheExpires * 1000);
        return result;
    };
};
export const api = {
    get: apize('get'),
    post: apize('post')
};

import './broadcast';
import './logs';
import './media';
import './search';

export default router;