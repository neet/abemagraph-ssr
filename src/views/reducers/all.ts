import * as moment from 'moment';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { StoreAll } from '../constant/store';
import { invalidateAll, allFetch } from '../actions/all';

const initialState: StoreAll = {
    date: moment(),
    allStatus: false,
    all: undefined
};
export const all = reducerWithInitialState(initialState)
    .case(allFetch.done, (state, payload) => {
        const [offset] = payload;
        return {
            ...state,
            date: moment.unix(offset).startOf('day'),
            allStatus: false,
            all: payload
        };
    })
    .case(allFetch.failed, (state, payload) => ({ ...state, allStatus: payload.status, all: undefined }))
    .case(invalidateAll, state => ({ ...state, allStatus: false, all: undefined }));