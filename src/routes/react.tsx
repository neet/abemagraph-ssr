import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Request, Response } from 'express';
import { StaticRouter, RouteProps, match, matchPath } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import * as _ from 'lodash';

import { Routes } from '../views/Routes';
import reducers from '../views/reducers';
import { broadcast, broadcastChannels, getSlot } from './api/index';
import { Store } from '../views/constant/store';

const routeInfo: Array<RouteProps & { fetchInitialState?: (state: Store, req: Request, match: match<{}>) => Promise<Store> }> = [
    {
        path: '/details/:slotId',
        exact: true,
        fetchInitialState: async (state: Store, req: Request, match: match<{ slotId: string }>) => {
            return _.merge(state, {
                app: {
                    slot: await getSlot(req, match.params.slotId) || undefined
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
                    broadcastSlots: await broadcast(req),
                    broadcastSlotUpdated: Date.now()
                }
            });
        }
    }
];

export const renderSSR = async (req: Request, res: Response) => {
    res.contentType('text/html');

    const initialState = await routeInfo.reduce((prom, route) => {
        const m = matchPath(req.url, route);
        return prom.then((state: Store) => m && route.fetchInitialState ? route.fetchInitialState(state, req, m) : Promise.resolve(state));
    }, Promise.resolve({
        app: {
            channels: broadcastChannels(req)
        }
    }));
    const store = createStore(reducers, initialState);
    const context: { url?: string, status: number, title: string } = {
        status: 200,
        title: 'AbemaGraph'
    };
    const appMarkup = renderToStaticMarkup(
        <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
                <Routes />
            </StaticRouter>
        </Provider>
    );
    const markup = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${context.title}</title>
<link href="/assets/app.css" rel="stylesheet" />
</head>
<body>
<div id="app">${appMarkup}</div>
<script>window.__INITIAL_STATE__ = ${JSON.stringify(store.getState())};</script>
<script src="/assets/manifest.js"></script>
<script defer src="/assets/vendor.js"></script>
<script defer src="/assets/app.js"></script>
</body>
</html>`;
    if (context.url) {
        res.redirect(context.url);
    } else {
        res.status(context.status);
        res.end(markup);
    }
};