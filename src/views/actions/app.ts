import { createAction } from 'redux-actions';

import { SET_CURRENT_TS } from '../constant/actions';
import { TAction } from '../utils/connect';

export const setCurrentTs = createAction(SET_CURRENT_TS);
export type ISetCurrentTs = TAction<typeof SET_CURRENT_TS, never>;

export type Actions = ISetCurrentTs;