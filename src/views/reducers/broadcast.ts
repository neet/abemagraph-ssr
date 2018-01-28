import { StoreBroadcast } from '../constant/store';
import { Actions } from '../actions/index';
import { RECEIVE_BROADCAST_SLOTS, REQUEST_BROADCAST_SLOTS, FAILED_FETCH_BROADCAST_SLOTS } from '../constant/actions';

const initialState: StoreBroadcast = {
    slots: [],
    updated: 0,
    isFailed: false,
    isFetching: false
};
export const broadcast = (state: StoreBroadcast = initialState, action: Actions) => {
    switch (action.type) {
        case RECEIVE_BROADCAST_SLOTS:
            return { ...state, slots: action.payload, updated: Date.now(), isFetching: false, isFailed: false };
        case REQUEST_BROADCAST_SLOTS:
            return { ...state, isFetching: true };
        case FAILED_FETCH_BROADCAST_SLOTS:
            return { ...state, isFetching: false, isFailed: true };
        default:
            return state;
    }
};