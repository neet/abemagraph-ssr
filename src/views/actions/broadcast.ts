import { Dispatch } from 'react-redux';
import { createAction } from 'redux-actions';
import { Action } from 'redux';

import { Slot } from '../../types/abema';
import { RECEIVE_BROADCAST_SLOTS, REQUEST_BROADCAST_SLOTS, FAILED_FETCH_BROADCAST_SLOTS } from '../constant/actions';
import { BroadcastSlot } from '../../types/abemagraph';
import { TAction } from '../utils/connect';

export const fetchBroadcastSlots = () => async (dispatch: Dispatch<Action>) => {
    dispatch(requestBroadcastSlots());
    const response = await fetch('/api/broadcast').catch(() => {
        dispatch(failedFetchBroadcastSlots());
    });
    if (response && response.ok) {
        const responseJson: BroadcastSlot[] = await response.json();
        dispatch(receiveBroadcastSlots(responseJson));
    } else {
        dispatch(failedFetchBroadcastSlots());
    }
};

export const receiveBroadcastSlots = createAction<BroadcastSlot[]>(RECEIVE_BROADCAST_SLOTS);
export type IReceiveBroadcastSlots = TAction<typeof RECEIVE_BROADCAST_SLOTS, BroadcastSlot[]>;

export const requestBroadcastSlots = createAction(REQUEST_BROADCAST_SLOTS);
export type IRequestBroadcastSlots = TAction<typeof REQUEST_BROADCAST_SLOTS, void>;

export const failedFetchBroadcastSlots = createAction(FAILED_FETCH_BROADCAST_SLOTS);
export type IFailedFetchBroadcastSlots = TAction<typeof FAILED_FETCH_BROADCAST_SLOTS, void>;

export type Actions = IReceiveBroadcastSlots | IRequestBroadcastSlots | IFailedFetchBroadcastSlots;