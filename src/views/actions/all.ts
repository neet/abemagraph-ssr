import { createAction } from 'redux-actions';
import * as moment from 'moment';

import { AllLogCompressed } from '../../types/abemagraph';
import { TAction } from '../utils/connect';
import { fetchAction } from '../utils/fetch-middleware';
import { INVALIDATE_ALL } from '../constant/actions';

export const fetchAll = (date: moment.Moment = moment()) => fetchAction(`/api/all/${date.format('YYYYMMDD')}`, 'ALL');

export type IReceiveAll = TAction<'FETCH_RECEIVED_ALL', AllLogCompressed>;
export type IRequestAll = TAction<'FETCH_REQUEST_ALL', void>;
export type IFailedFetchAll = TAction<'FETCH_FAILED_ALL', void>;

export const invalidateAll = createAction(INVALIDATE_ALL);
type IInvalidateAll = TAction<typeof INVALIDATE_ALL, void>;

export type Actions = IReceiveAll | IRequestAll | IFailedFetchAll | IInvalidateAll;