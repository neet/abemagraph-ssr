import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { StoreBroadcast } from '../constant/store';
import { broadcastApi } from '../actions/broadcast';

const initialState: StoreBroadcast = {
    slots: [],
    updated: 0,
    isFailed: false,
    isFetching: false
};
export const broadcast = reducerWithInitialState(initialState)
    .case(broadcastApi.done, (state, payload) => ({ ...state, slots: payload, updated: Date.now(), isFetching: false, isFailed: false }))
    .case(broadcastApi.started, state => ({ ...state, isFetching: true }))
    .case(broadcastApi.failed, state => ({ ...state, isFetching: false, isFailed: true, slots: [] }));