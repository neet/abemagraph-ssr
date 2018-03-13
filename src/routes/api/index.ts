import { Router, Request, Response } from 'express';
import { broadcast, broadcastChannels } from './broadcast';
import { channels, getSlot } from './media';
import { slotLog, allLog } from './logs';
import { search } from './search';

const router = Router();

const apize = (method: 'get' | 'post') => <P, R, P1, P2>(path: string, func: (param?: P) => Promise<R>, transform?: (param: P1, query: P2) => P) => {
    router[method](path, (req, res, next) => {
        func(transform ? transform(req.params, req.query) : undefined)
            .then(result => res.json(result))
            .catch(err => {
                if (err.expose)
                    res.status(err.statusCode).end(err.message);
                else
                    res.status(400).end();
            });
    });
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