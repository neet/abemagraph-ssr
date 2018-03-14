import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { StoreSlot } from '../constant/store';
import { slotApi, slotLogsApi, invalidateSlot } from '../actions/slot';

const initialState: StoreSlot = {
    slot: undefined,
    slotStatus: false,
    logsStatus: false,
    logs: undefined
};

export const slot = reducerWithInitialState(initialState)
    .case(slotApi.done, (state, payload) => ({ ...state, slot: payload, slotStatus: false }))
    .case(slotApi.failed, (state, payload) => ({ ...state, slotStatus: payload.status, slot: undefined }))
    .case(slotLogsApi.done, (state, payload) => ({ ...state, logs: payload, logsStatus: false }))
    .case(slotLogsApi.failed, (state, payload) => ({ ...state, logsStatus: payload.status, logs: undefined }))
    .case(invalidateSlot, state => ({ ...state, slot: undefined, logs: undefined }));