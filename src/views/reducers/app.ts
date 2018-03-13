import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { StoreApp } from '../constant/store';
import { channelsApi } from '../actions/app';

const initialState: StoreApp = {
    channels: []
};
export const app = reducerWithInitialState(initialState)
    .case(channelsApi.done, (state, payload) => ({ ...state, channels: payload }));