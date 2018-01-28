import * as broadcast from './broadcast';
import * as app from './app';
import * as slot from './slot';

export default {
    app,
    broadcast,
    slot
};
export type Actions = broadcast.Actions | app.Actions | slot.Actions;