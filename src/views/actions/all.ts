import createActionFactory from 'typescript-fsa';
import * as moment from 'moment';

import { AllLogCompressed } from '../../types/abemagraph';
import { fetchActionCreator } from '../utils/fetch-middleware';

const createAction = createActionFactory('ALL');

export const allApi = fetchActionCreator<AllLogCompressed>('ALL');
export const fetchAll = (date: moment.Moment = moment()) => dispatch => {
    dispatch(allApi.fetch(`/api/all/${date.format('YYYYMMDD')}`));
    dispatch(setDate(date));
};
export const setDate = createAction<moment.Moment>('SET_DATE');
export const invalidateAll = createAction('INVALIDATE');