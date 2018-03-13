import createActionFactory from 'typescript-fsa';
import * as moment from 'moment';

import { AllLogCompressed } from '../../types/abemagraph';
import { fetchActionCreator } from '../utils/fetch-middleware';

const createAction = createActionFactory();

export const allApi = fetchActionCreator<AllLogCompressed>('ALL');
export const fetchAll = (date: moment.Moment = moment()) => allApi.fetch(`/api/all/${date.format('YYYYMMDD')}`);
export const invalidateAll = createAction('INVALIDATE_ALL');