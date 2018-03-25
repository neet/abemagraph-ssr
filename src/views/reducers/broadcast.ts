import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { StoreBroadcast } from '../constant/store';
import { broadcastApi, setSortType } from '../actions/broadcast';

const initialState: StoreBroadcast = {
    slots: [],
    updated: 0,
    isFailed: false,
    isFetching: false,
    sortType: 'vpm'
};
export const broadcast = reducerWithInitialState(initialState)
    .case(broadcastApi.done, (state, slots) => ({
        ...state,
        slots,
        updated: Date.now(),
        isFetching: false,
        isFailed: false
    }))
    .case(broadcastApi.started, state => ({ ...state, isFetching: true }))
    .case(broadcastApi.failed, state => ({ ...state, isFetching: false, isFailed: true, slots: [] }))
    .case(setSortType, (state, sortType) => ({ ...state, sortType }));