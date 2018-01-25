import { createAction } from 'redux-actions';

import { TAction } from '../utils/connect';
import { Dispatch } from 'react-redux';
import { Action } from 'redux';
import { Channel } from '../../types/abema';
import { SET_CHANNELS, SET_BROADCAST_SLOTS } from '../constant/actions';
import { BroadcastSlot } from '../../types/abemagraph';

export const fetchChannels = () => async (dispatch: Dispatch<Action>) => {
    const response = await fetch('/api/broadcast/channels');
    const responseJson: Channel[] = await response.json();
    dispatch(setChannels(responseJson));
};

export const fetchBroadcastSlots = () => async (dispatch: Dispatch<Action>) => {
    const response = await fetch('/api/broadcast');
    const responseJson: BroadcastSlot[] = await response.json();
    dispatch(setBroadcastSlots(responseJson));
};

export const setChannels = createAction<Channel[]>(SET_CHANNELS);
type ISetChannels = TAction<typeof SET_CHANNELS, Channel[]>;

export const setBroadcastSlots = createAction<BroadcastSlot[]>(SET_BROADCAST_SLOTS);
type ISetBroadcastSlots = TAction<typeof SET_BROADCAST_SLOTS, BroadcastSlot[]>;

export type Actions = ISetChannels | ISetBroadcastSlots;