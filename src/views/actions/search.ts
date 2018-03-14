import createActionFactory from 'typescript-fsa';
import * as moment from 'moment';

import { SearchResult } from '../../types/abemagraph';
import { fetchActionCreator } from '../utils/fetch-middleware';

const createAction = createActionFactory();

export const searchApi = fetchActionCreator<SearchResult>('SEARCH');
export const fetchSearch = (query: string, page = 0) => dispatch => {
    dispatch(setQuery({ query, page }));
    dispatch(searchApi.fetch(`/api/search?q=${encodeURI(query)}&page=${page}`));
};
export const invalidateSearch = createAction('INVALIDATE_SEARCH');
export const setQuery = createAction<{ query: string, page: number }>('SEARCH_SET_QUERY');