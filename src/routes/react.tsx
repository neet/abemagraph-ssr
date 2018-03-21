import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Request, Response } from 'express';
import { StaticRouter, RouteProps, match, matchPath, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import * as _ from 'lodash';
import * as moment from 'moment';

import { Routes } from '../views/Routes';
import reducers from '../views/reducers';
import { Store } from '../views/constant/store';
import { getSlot } from './api/media';
import { broadcast, broadcastChannels } from './api/broadcast';
import { allLog } from './api/logs';
import Config from '../config';
import { search } from './api/search';

const routeInfo: Array<RouteProps & { fetchInitialState?: (state: Store, req: Request, match: match<{}>) => Promise<Store> }> = [
    {
        path: '/details/:slotId',
        exact: true,
        fetchInitialState: async (state: Store, req: Request, match: match<{ slotId: string }>) => {
            const slot = await getSlot(match.params.slotId);
            return _.merge(state, {
                slot: {
                    slot: slot || undefined,
                    slotStatus: slot ? false : 404
                }
            });
        }
    },
    {
        path: '/',
        exact: true,
        fetchInitialState: async (state: Store, req: Request, match: match<{ slotId: string }>) => {
            return _.merge(state, {
                broadcast: {
                    slots: await broadcast(),
                    updated: Date.now()
                }
            });
        }
    },
    {
        path: '/all/:date?',
        fetchInitialState: async (state: Store, req: Request, match: match<{ date?: string }>) => {
            let date = moment(match.params.date, 'YYYYMMDD');
            if (!date.isValid()) date = moment();
            const all = await allLog(date.format('YYYYMMDD'));
            if (!all) return state;
            return _.merge(state, {
                all: {
                    all,
                    date
                }
            });
        }
    },
    {
        path: '/search',
        fetchInitialState: async (state: Store, req: Request) => {
            if (typeof req.query.q === 'string') {
                const page = Number(req.query.page || '');
                const result = await search({ query: req.query.q, page: isNaN(page) ? 0 : page });
                return _.merge(state, {
                    search: {
                        result,
                        page,
                        query: req.query.q,
                        status: false
                    }
                });
            }
            return state;
        }
    }
];

const sanitize = str => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
export const renderSSR = async (req: Request, res: Response) => {
    res.contentType('text/html');

    const url = req.url.replace(/\?.+$/, '');
    const initialState = await routeInfo.reduce((prom, route) => {
        const m = matchPath(url, route);
        return prom.then((state: Store) => m && route.fetchInitialState ?
            route.fetchInitialState(state, req, m).catch(() => state) : Promise.resolve(state));
    }, Promise.resolve({
        app: {
            channels: await broadcastChannels()
        }
    }));
    const store = createStore(reducers, initialState);
    const context: { url?: string, status: number, title: string, meta: { [key: string]: string } } = {
        status: 200,
        title: 'AbemaGraph',
        meta: {}
    };
    const appMarkup = renderToStaticMarkup(
        <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
                <Route component={Routes} />
            </StaticRouter>
        </Provider>
    );
    if (context.url) {
        res.redirect(context.url);
        return;
    }
    const markup = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
${_.map(context.meta, (value, key) => `<meta property="${key}" content="${sanitize(value)}" />`).join('')}
<title>${context.title}</title>
<link rel="shortcut icon" href="/assets/favicon.ico" type="image/x-icon" />
<link href="/assets/app.css" rel="stylesheet" />
</head>
<body>
<div id="app">${appMarkup}</div>
<script>window.__INITIAL_STATE__ = ${JSON.stringify(store.getState())};</script>
<script src="/assets/manifest.js"></script>
<script defer src="/assets/vendor.js"></script>
<script defer src="/assets/app.js"></script>
${Config.trackingCode}
</body>
</html>`;
    res.status(context.status);
    res.end(markup);
};