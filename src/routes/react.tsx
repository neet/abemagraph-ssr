import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Request, Response } from 'express';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { Routes } from '../views/Routes';
import reducers from '../views/reducers';
import { broadcast } from './api/index';

export const renderSSR = async (req: Request, res: Response) => {
    res.contentType('text/html');

    const store = createStore(reducers, {
        app: {
            broadcastSlots: await broadcast(req),
            broadcastSlotUpdated: Date.now()
        }
    });
    const context: { url?: string, status: number } = {
        status: 200
    };
    const markup = renderToStaticMarkup(
        <html lang='ja'>
            <head>
                <title>AbemaGraph</title>
                <link href='/assets/app.css' rel='stylesheet' />
            </head>
            <body>
                <div id='app'>
                    <Provider store={store}>
                        <StaticRouter location={req.url} context={context}>
                            <Routes />
                        </StaticRouter>
                    </Provider>
                </div>
                <div id='initial-data' data-json={JSON.stringify(store.getState())} />
                <script src='/assets/loader.js' />
                <script async defer src='/assets/vendor.js' />
                <script async defer src='/assets/app.js' />
            </body>
        </html>
    );
    if (context.url) {
        res.redirect(context.url);
    } else {
        res.status(context.status);
        res.end(markup);
    }
};