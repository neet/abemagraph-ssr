import createActionFactory from 'typescript-fsa';
import * as moment from 'moment';

import { AllLogCompressed } from '../../types/abemagraph';
import { fetchActionCreator } from '../utils/fetch-middleware';

const createAction = createActionFactory();

export const allFetch = fetchActionCreator<AllLogCompressed>('ALL');
export const fetchAll = (date: moment.Moment = moment()) => allFetch.fetch(`/api/all/${date.format('YYYYMMDD')}`);
export const invalidateAll = createAction('INVALIDATE_ALL');