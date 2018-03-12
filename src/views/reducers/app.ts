import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { StoreApp } from '../constant/store';
import { channelsFetch } from '../actions/app';

const initialState: StoreApp = {
    channels: []
};
export const app = reducerWithInitialState(initialState)
    .case(channelsFetch.done, (state, payload) => ({ ...state, channels: payload }));