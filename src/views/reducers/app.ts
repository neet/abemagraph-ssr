import { StoreApp } from '../constant/store';
import { Actions } from '../actions/index';
import { SET_CHANNELS, SET_SLOT } from '../constant/actions';

const initialState: StoreApp = {
    channels: [],
    slot: null
};
export const app = (state: StoreApp = initialState, action: Actions): StoreApp => {
    switch (action.type) {
        case SET_CHANNELS:
            return { ...state, channels: action.payload };
        case SET_SLOT:
            return { ...state, slot: action.payload };
        default:
            return state;
    }
};