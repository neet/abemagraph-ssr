import { Action, Store, MiddlewareAPI, Dispatch } from 'redux';

type FetchAction = { type: 'FETCH', meta?: { url: string, response: string } };
export const fetchMiddleware = ({ dispatch }: MiddlewareAPI<{}>) => (next: Dispatch<{}>) => (action: FetchAction) => {
    if (action.type === 'FETCH' && action.meta) {
        const { url, response } = action.meta;
        fetch(url).then(res => res.json()).then(res => {
            dispatch({ type: `FETCH_RECEIVED_${response}`, payload: res });
        }).catch(err => {
            dispatch({ type: `FETCH_FAILED_${response}` });
        });
        return next({ type: `FETCH_REQUEST_${response}` });
    }
    return next(action);
};

export const fetchAction = (url: string, response: string) => ({ type: 'FETCH', meta: { url, response } });