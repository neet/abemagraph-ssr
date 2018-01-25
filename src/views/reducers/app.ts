import { StoreApp } from '../constant/store';
import { Actions } from '../actions/index';
import { SET_CHANNELS, SET_BROADCAST_SLOTS } from '../constant/actions';

const initialState: StoreApp = {
    channels: [],
    broadcastSlots: [],
    broadcastSlotUpdated: Date.now()
};
export const app = (state: StoreApp = initialState, action: Actions): StoreApp => {
    switch (action.type) {
        case SET_CHANNELS:
            return { ...state, channels: action.payload };
        case SET_BROADCAST_SLOTS:
            return { ...state, broadcastSlots: action.payload, broadcastSlotUpdated: Date.now() };
        default:
            return state;
    }
};