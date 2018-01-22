import * as React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { Request, Response } from 'express';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { Routes } from '../views/Routes';
import reducers from '../views/reducers';
import { broadcast } from './api/index';

export const renderSSR = async (req: Request, res: Response) => {
    res.contentType('text/html').status(200);

    const store = createStore(reducers, {
        app: {
            broadcastSlots: await broadcast(req),
            broadcastSlotUpdated: Date.now()
        }
    });
    renderToNodeStream(
        <html lang='ja'>
            <head>
                <title>AbemaGraph</title>
                <link href='/assets/app.css' rel='stylesheet' />
            </head>
            <body>
                <div id='app'>
                    <Provider store={store}>
                        <StaticRouter location={req.url} context={{}}>
                            <Routes />
                        </StaticRouter>
                    </Provider>
                </div>
                <div id='initial-data' data-json={JSON.stringify(store.getState())} />
                <script src='/assets/vendor.js' />
                <script src='/assets/app.js' />
            </body>
        </html>
    ).pipe(res);
};