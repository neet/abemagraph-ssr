import * as express from 'express';
import { MongoClient } from 'mongodb';
import * as LRU from 'lru-cache';
import * as fs from 'fs';

import 'moment/locale/ja';

import Config from './config';
import { downloadTimetable } from './collector/timetable';
import { Collector } from './collector/index';
import { Client } from 'elasticsearch';
import { renderSSR } from './routes/react';
import api from './routes/api';

(async () => {
    const connection = await MongoClient.connect(Config.mongo.uri);
    const db = connection.db(Config.mongo.db);
    const es = new Client({ host: Config.elasticsearch.host });
    const cache = LRU(1000);

    const collector = new Collector(db, es);
    await collector.loadTimetableFromFile();
    collector.startSchedule();

    const app = express();
    app.listen(Config.port);
    app.set('collector', collector);
    app.set('cache', cache);

    app.use('/api', api);
    app.use('/assets', express.static('./assets'));
    app.get('/favicon.ico', (req, res, next) => res.status(404).end());
    app.get('*', (req, res, next) => {
        renderSSR(req, res);
    });
})();
