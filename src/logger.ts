import * as log4js from 'log4js';
import Config from './config';

log4js.configure(Config.logger);

export const www = log4js.getLogger('www');
export const wwwLogger = log4js.connectLogger(www, { level: 'auto' });
export const app = log4js.getLogger('app');