import { StoreBroadcast } from '../constant/store';
import { Actions } from '../actions/index';

const initialState: StoreBroadcast = {
    slots: [],
    updated: 0,
    isFailed: false,
    isFetching: false
};
export const broadcast = (state: StoreBroadcast = initialState, action: Actions): StoreBroadcast => {
    switch (action.type) {
        case 'FETCH_RECEIVED_BROADCAST_SLOT':
            return { ...state, slots: action.payload, updated: Date.now(), isFetching: false, isFailed: false };
        case 'FETCH_REQUEST_BROADCAST_SLOT':
            return { ...state, isFetching: true };
        case 'FETCH_FAILED_BROADCAST_SLOT':
            return { ...state, isFetching: false, isFailed: true, slots: [] };
        default:
            return state;
    }
};