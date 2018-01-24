import { Dispatch } from 'react-redux';
import { createAction } from 'redux-actions';
import { Action } from 'redux';

import { Slot } from '../../types/abema';
import { SET_BROADCAST_SLOTS } from '../constant/actions';
import { BroadcastSlot } from '../../types/abemagraph';
import { TAction } from '../utils/connect';

export const fetchBroadcastSlots = () => async (dispatch: Dispatch<Action>) => {
    const response = await fetch('/api/broadcast');
    const responseJson: BroadcastSlot[] = await response.json();
    dispatch(setBroadcastSlots(responseJson));
};

export const setBroadcastSlots = createAction<BroadcastSlot[]>(SET_BROADCAST_SLOTS);
export type ISetBroadcastSlots = TAction<typeof SET_BROADCAST_SLOTS, BroadcastSlot[]>;

export type Actions = ISetBroadcastSlots;