import { StoreApp } from '../constant/store';
import { Actions } from '../actions/index';
import { SET_BROADCAST_SLOTS } from '../constant/actions';

const initialState: StoreApp = {
    currentTs: Date.now()
};
export const app = (state: StoreApp = initialState, action: Actions) => {
    switch (action.type) {
        default:
            return state;
    }
};