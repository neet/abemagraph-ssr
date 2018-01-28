import { Dispatch } from 'react-redux';
import { createAction } from 'redux-actions';
import { Action } from 'redux';

import { Slot } from '../../types/abema';
import { BroadcastSlot } from '../../types/abemagraph';
import { TAction } from '../utils/connect';
import { fetchAction } from '../utils/fetch-middleware';

export const fetchBroadcastSlots = () => fetchAction('/api/broadcast', 'BROADCAST_SLOT');

export type IReceiveBroadcastSlots = TAction<'FETCH_RECEIVED_BROADCAST_SLOT', BroadcastSlot[]>;
export type IRequestBroadcastSlots = TAction<'FETCH_REQUEST_BROADCAST_SLOT', void>;
export type IFailedFetchBroadcastSlots = TAction<'FETCH_FAILED_BROADCAST_SLOT', void>;

export type Actions = IReceiveBroadcastSlots | IRequestBroadcastSlots | IFailedFetchBroadcastSlots;