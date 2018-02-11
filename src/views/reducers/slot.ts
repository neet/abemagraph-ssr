import { StoreSlot } from '../constant/store';
import { Actions } from '../actions/index';
import { INVALIDATE_SLOT } from '../constant/actions';

const initialState: StoreSlot = {
    slot: undefined,
    slotStatus: false,
    logsStatus: false,
    logs: undefined
};
export const slot = (state: StoreSlot = initialState, action: Actions): StoreSlot => {
    switch (action.type) {
        case 'FETCH_RECEIVED_SLOT':
            return { ...state, slot: action.payload, slotStatus: false };
        case 'FETCH_FAILED_SLOT':
            return { ...state, slotStatus: action.meta.status, slot: undefined };
        case INVALIDATE_SLOT:
            return { ...state, slot: undefined, logs: undefined };
        case 'FETCH_RECEIVED_SLOT_LOGS':
            return { ...state, logs: action.payload, logsStatus: false };
        case 'FETCH_FAILED_SLOT_LOGS':
            return { ...state, logsStatus: action.meta.status, logs: undefined };
        default:
            return state;
    }
};