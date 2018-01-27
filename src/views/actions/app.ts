import { createAction } from 'redux-actions';

import { TAction } from '../utils/connect';
import { Dispatch } from 'react-redux';
import { Action } from 'redux';
import { Channel, Slot } from '../../types/abema';
import { SET_CHANNELS, SET_SLOT } from '../constant/actions';

export const fetchChannels = () => async (dispatch: Dispatch<Action>) => {
    const response = await fetch('/api/broadcast/channels');
    const responseJson: Channel[] = await response.json();
    dispatch(setChannels(responseJson));
};

export const fetchSlot = (slotId: string) => async (dispatch: Dispatch<Action>) => {
    const response = await fetch(`/api/slots/${slotId}`);
    const responseJson: Slot = await response.json();
    dispatch(setSlot(responseJson));
};

export const setChannels = createAction<Channel[]>(SET_CHANNELS);
type ISetChannels = TAction<typeof SET_CHANNELS, Channel[]>;

export const setSlot = createAction<Slot | null>(SET_SLOT);
type ISetSlot = TAction<typeof SET_SLOT, Slot | null>;

export type Actions = ISetChannels | ISetSlot;