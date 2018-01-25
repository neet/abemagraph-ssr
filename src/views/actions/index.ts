import * as broadcast from './broadcast';
import * as app from './app';

export default {
    app,
    broadcast
};
export type Actions = broadcast.Actions | app.Actions;