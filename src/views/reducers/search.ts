import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { StoreSearch } from '../constant/store';
import { searchApi, setQuery, invalidateSearch } from '../actions/search';

const initialState: StoreSearch = {
    status: false,
    query: '',
    page: 0
};
export const search = reducerWithInitialState(initialState)
    .case(searchApi.done, (state, payload) => ({ ...state, result: payload, status: false }))
    .case(searchApi.failed, (state, payload) => ({ ...state, result: undefined, status: payload.status }))
    .case(invalidateSearch, state => ({ ...state, result: undefined, status: false, query: '' }))
    .case(setQuery, (state, payload) => ({ ...state, query: payload.query, page: payload.page }));