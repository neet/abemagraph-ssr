import { StoreApp } from '../constant/store';
import { Actions } from '../actions/index';
import { SET_BROADCAST_SLOTS } from '../constant/actions';

const initialState: StoreApp = {
    broadcastSlots: [],
    broadcastSlotUpdated: 0
};
export const app = (state: StoreApp = initialState, action: Actions) => {
    switch (action.type) {
        case SET_BROADCAST_SLOTS:
            return { ...state, broadcastSlots: action.payload, broadcastSlotUpdated: Date.now() };
        default:
            return state;
    }
};