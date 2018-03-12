import { connect as reduxConnect, MapStateToPropsParam, MapStateToProps, InferableComponentEnhancerWithProps } from 'react-redux';
import { bindActionCreators, Dispatch, ActionCreatorsMapObject, AnyAction } from 'redux';

import actions from '../actions';
import { Store } from '../constant/store';

interface ActionMap {
    [key: string]: Function | ActionMap;
}

export interface TAction<TType, TPayload, TMeta = {}> extends AnyAction {
    type: TType;
    payload: TPayload;
    meta: TMeta;
}

export interface ActionProps {
    actions: typeof actions;
}

export type ReduxProps<T> = ActionProps & T;

function bind(actionMap: ActionMap | Function, dispatch: Dispatch<{}>): {} {
    if (typeof actionMap === 'function') {
        return ((...params) => dispatch(actionMap(...params)));
    }
    const keys = Object.keys(actionMap);
    return keys.reduce((acc, key) => Object.assign(acc, { [key]: bind(actionMap[key] as ActionMap, dispatch) }), {});
}

export function connect<TOwnProps = {}, TImplProps = {}, TStateProps = Store>(mapStateToProps: {[key in keyof TOwnProps]: (state: TStateProps) => TOwnProps[key]}) {
    return reduxConnect<TOwnProps, ActionProps>(
        (state: TStateProps): TOwnProps => {
            const keys = Object.keys(mapStateToProps);
            return keys.reduce((acc: TOwnProps, key: keyof TOwnProps) => Object.assign(acc, { [key]: mapStateToProps[key](state) }), {} as TOwnProps);
        },
        bind.bind(null, { actions }) as ActionProps
    );
}