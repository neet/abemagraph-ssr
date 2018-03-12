import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { StoreBroadcast } from '../constant/store';
import { broadcastFetch } from '../actions/broadcast';

const initialState: StoreBroadcast = {
    slots: [],
    updated: 0,
    isFailed: false,
    isFetching: false
};
export const broadcast = reducerWithInitialState(initialState)
    .case(broadcastFetch.done, (state, payload) => ({ ...state, slots: payload, updated: Date.now(), isFetching: false, isFailed: false }))
    .case(broadcastFetch.started, state => ({ ...state, isFetching: true }))
    .case(broadcastFetch.failed, state => ({ ...state, isFetching: false, isFailed: true, slots: [] }));