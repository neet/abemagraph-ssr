import { StoreApp } from '../constant/store';
import { Actions } from '../actions/index';
import { SET_CHANNELS, SET_SLOT, UNSET_SLOT } from '../constant/actions';

const initialState: StoreApp = {
    channels: [],
    slot: undefined
};
export const app = (state: StoreApp = initialState, action: Actions): StoreApp => {
    switch (action.type) {
        case SET_CHANNELS:
            return { ...state, channels: action.payload };
        case SET_SLOT:
            return { ...state, slot: action.payload };
        case UNSET_SLOT:
            return { ...state, slot: undefined };
        default:
            return state;
    }
};