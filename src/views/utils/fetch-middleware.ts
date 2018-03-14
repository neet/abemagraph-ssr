import { MiddlewareAPI, Dispatch } from 'redux';
import actionCreatorFactory, { ActionCreator } from 'typescript-fsa';

const actionCreator = actionCreatorFactory();

type FetchAction = { type: 'FETCH', meta?: { url: string, response: string } };
type FetchFailedPayload = { status: number, err?: {} };
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
                dispatch({ type: `FETCH_FAILED_${response}`, payload: { status: 600 } });
            else
                dispatch({ type: `FETCH_FAILED_${response}`, payload: { status: err.status || 500, err } });
        });
        return next({ type: `FETCH_REQUEST_${response}` });
    }
    return next(action);
};

const fetchRequestAction = (url: string, response: string): FetchAction => ({ type: 'FETCH', meta: { url, response } });
type FetchActionCreator<T> = {
    fetch: (url: string) => FetchAction,
    started: ActionCreator<void>,
    done: ActionCreator<T>,
    failed: ActionCreator<FetchFailedPayload>
};
export const fetchActionCreator = <T>(response: string): FetchActionCreator<T> => ({
    fetch: url => fetchRequestAction(url, response),
    started: actionCreator<void>(`FETCH_REQUEST_${response}`),
    done: actionCreator<T>(`FETCH_RECEIVED_${response}`),
    failed: actionCreator<FetchFailedPayload>(`FETCH_FAILED_${response}`)
});