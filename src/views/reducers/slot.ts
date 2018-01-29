import { StoreSlot } from '../constant/store';
import { Actions } from '../actions/index';

const initialState: StoreSlot = {
    slot: undefined,
    isFailed: false
};
export const slot = (state: StoreSlot = initialState, action: Actions) => {
    switch (action.type) {
        case 'FETCH_RECEIVED_SLOT':
            return { ...state, slot: action.payload, isFailed: false };
        case 'FETCH_FAILED_SLOT':
            return { ...state, isFailed: true, slot: undefined };
        case INVALIDATE_SLOT:
            return { ...state, slot: undefined };
        default:
            return state;
    }
};