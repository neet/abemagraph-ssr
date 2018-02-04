import * as moment from 'moment';

import { StoreAll } from '../constant/store';
import { Actions } from '../actions/index';
import { INVALIDATE_ALL } from '../constant/actions';

const initialState: StoreAll = {
    date: moment(),
    isAllFailed: false,
    all: undefined
};
export const all = (state: StoreAll = initialState, action: Actions): StoreAll => {
    switch (action.type) {
        case 'FETCH_RECEIVED_ALL':
            const [offset] = action.payload;
            return {
                ...state,
                date: moment.unix(offset).startOf('day'),
                isAllFailed: false,
                all: action.payload
            };
        case 'FETCH_FAILED_ALL':
            return { ...state, isAllFailed: true, all: undefined };
        case INVALIDATE_ALL:
            return { ...state, isAllFailed: false, all: undefined };
        default:
            return state;
    }
};