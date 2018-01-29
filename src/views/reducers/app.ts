import { StoreApp } from '../constant/store';
import { Actions } from '../actions/index';

const initialState: StoreApp = {
    channels: []
};
export const app = (state: StoreApp = initialState, action: Actions): StoreApp => {
    switch (action.type) {
        case 'FETCH_RECEIVED_CHANNELS':
            return { ...state, channels: action.payload };
        default:
            return state;
    }
};