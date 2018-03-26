import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { Configuration } from 'log4js';
import { Client } from 'elasticsearch';

interface Config {
    mongo: {
        uri: string;
        db: string;
    };
    elasticsearch: {
        host: string;
        index: string;
        type: string;
    };
    port: number;
    abema: {
        token: string;
        userId: string;
        timetableUpdateInterval: number;
    };
    cache: {
        timetable: string;
    };
    logger: Configuration;
    trackingCode: string;
}

const config = (() => safeLoad(readFileSync('./config.yml', { encoding: 'utf8' })))() as Config;
export default config;

export const assetsManifest = (() => JSON.parse(readFileSync('./assets/webpack-manifest.json', { encoding: 'utf8' })))() as { [key: string]: string };