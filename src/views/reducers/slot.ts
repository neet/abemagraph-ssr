import { StoreSlot } from '../constant/store';
import { Actions } from '../actions/index';
import { INVALIDATE_SLOT } from '../constant/actions';

const initialState: StoreSlot = {
    slot: undefined,
    isSlotFailed: false,
    isLogsFailed: false,
    logs: []
};
export const slot = (state: StoreSlot = initialState, action: Actions) => {
    switch (action.type) {
        case 'FETCH_RECEIVED_SLOT':
            return { ...state, slot: action.payload, isSlotFailed: false };
        case 'FETCH_FAILED_SLOT':
            return { ...state, isSlotFailed: true, slot: undefined };
        case INVALIDATE_SLOT:
            return { ...state, slot: undefined, logs: undefined };
        case 'FETCH_RECEIVED_SLOT_LOGS':
            return { ...state, logs: action.payload, isLogsFailed: false };
        case 'FETCH_FAILED_SLOT_LOGS':
            return { ...state, isLogsFailed: true, logs: undefined };
        default:
            return state;
    }
};