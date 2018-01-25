import { StoreApp } from '../constant/store';
import { Actions } from '../actions/index';
import { SET_CHANNELS } from '../constant/actions';

const initialState: StoreApp = {
    channels: []
};
export const app = (state: StoreApp = initialState, action: Actions): StoreApp => {
    switch (action.type) {
        case SET_CHANNELS:
            return { ...state, channels: action.payload };
        default:
            return state;
    }
};