import { Action, Store, MiddlewareAPI, Dispatch } from 'redux';

type FetchAction = { type: 'FETCH', meta?: { url: string, response: string } };
export type FetchFailedMeta = { status: number };
export const fetchMiddleware = ({ dispatch }: MiddlewareAPI<{}>) => (next: Dispatch<{}>) => (action: FetchAction) => {
    if (action.type === 'FETCH' && action.meta) {
        const { url, response } = action.meta;
        fetch(url).then(res => {
            if (!res.ok) {
                return Promise.reject({ status: res.status });
            }
            return res.json();
        }).then(res => {
            dispatch({ type: `FETCH_RECEIVED_${response}`, payload: res });
        }).catch(err => {
            if (err instanceof Error)
                dispatch({ type: `FETCH_FAILED_${response}`, meta: { status: 600 } });
            else
                dispatch({ type: `FETCH_FAILED_${response}`, meta: err });
        });
        return next({ type: `FETCH_REQUEST_${response}` });
    }
    return next(action);
};

export const fetchAction = (url: string, response: string) => ({ type: 'FETCH', meta: { url, response } });