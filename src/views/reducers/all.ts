import * as moment from 'moment';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { StoreAll } from '../constant/store';
import { invalidateAll, allApi, setDate } from '../actions/all';

const initialState: StoreAll = {
    date: moment().startOf('day'),
    all: undefined,
    isFailed: false,
    isFetching: false
};
export const all = reducerWithInitialState(initialState)
    .case(allApi.done, (state, payload) => {
        const [offset] = payload;
        return {
            ...state,
            date: moment.unix(offset).startOf('day'),
            isFetching: false,
            isFailed: false,
            all: payload
        };
    })
    .case(allApi.started, state => ({ ...state, isFetching: true }))
    .case(allApi.failed, (state, payload) => ({ ...state, isFetching: false, isFailed: true }))
    .case(setDate, (state, payload) => ({ ...state, date: payload }))
    .case(invalidateAll, state => ({ ...state, isFailed: false, isFetching: false, all: undefined }));