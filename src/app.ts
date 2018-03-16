import * as express from 'express';
import { MongoClient } from 'mongodb';

import 'moment/locale/ja';

import Config from './config';
import { collector } from './collector/index';
import { Client } from 'elasticsearch';
import { renderSSR } from './routes/react';
import api from './routes/api';

(async () => {
    const connection = await MongoClient.connect(Config.mongo.uri);
    const db = connection.db(Config.mongo.db);
    const es = new Client({ host: Config.elasticsearch.host });

    collector.initialize(db, es);
    await collector.loadTimetableFromFile();
    collector.startSchedule();

    const app = express();
    app.listen(Config.port);

    app.use('/api', api);
    app.use('/assets', express.static('./assets'));
    app.get('/favicon.ico', (req, res, next) => res.status(404).end());
    app.get('*', (req, res, next) => {
        renderSSR(req, res);
    });
})();
