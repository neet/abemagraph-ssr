import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { StoreSlot } from '../constant/store';
import { slotFetch, slotLogsFetch, invalidateSlot } from '../actions/slot';

const initialState: StoreSlot = {
    slot: undefined,
    slotStatus: false,
    logsStatus: false,
    logs: undefined
};

export const slot = reducerWithInitialState(initialState)
    .case(slotFetch.done, (state, payload) => ({ ...state, slot: payload, slotStatus: false }))
    .case(slotFetch.failed, (state, payload) => ({ ...state, slotStatus: payload.status, slot: undefined }))
    .case(slotLogsFetch.done, (state, payload) => ({ ...state, logs: payload, logsStatus: false }))
    .case(slotLogsFetch.failed, (state, payload) => ({ ...state, logsStatus: payload.status, logs: undefined }))
    .case(invalidateSlot, state => ({ ...state, slot: undefined, logs: undefined }));