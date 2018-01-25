import { StoreBroadcast } from '../constant/store';
import { Actions } from '../actions/index';
import { SET_BROADCAST_SLOTS } from '../constant/actions';

const initialState: StoreBroadcast = {
    broadcastSlots: [],
    broadcastSlotUpdated: 0
};
export const broadcast = (state: StoreBroadcast = initialState, action: Actions) => {
    switch (action.type) {
        case SET_BROADCAST_SLOTS:
            return { ...state, broadcastSlots: action.payload, broadcastSlotUpdated: Date.now() };
        default:
            return state;
    }
};