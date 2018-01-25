import { createAction } from 'redux-actions';

import { TAction } from '../utils/connect';
import { Dispatch } from 'react-redux';
import { Action } from 'redux';
import { Channel } from '../../types/abema';
import { SET_CHANNELS } from '../constant/actions';

export const fetchChannels = () => async (dispatch: Dispatch<Action>) => {
    const response = await fetch('/api/broadcast/channels');
    const responseJson: Channel[] = await response.json();
    dispatch(setChannels(responseJson));
};

export const setChannels = createAction<Channel[]>(SET_CHANNELS);
type ISetChannels = TAction<typeof SET_CHANNELS, Channel[]>;

export type Actions = ISetChannels;