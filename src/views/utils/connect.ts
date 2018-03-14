import { connect as reduxConnect, ActionCreator } from 'react-redux';
import { bindActionCreators, Dispatch, ActionCreatorsMapObject, AnyAction } from 'redux';

import actions from '../actions';
import { Store } from '../constant/store';

interface ActionMap {
    [key: string]: Function | ActionMap;
}

export interface ActionProps {
    actions: typeof actions;
}

export type ReduxProps<T> = ActionProps & T;

function bind(actionMap: ActionMap | ActionCreator<{}>, dispatch: Dispatch<{}>): {} {
    if (typeof actionMap === 'function') {
        return bindActionCreators(actionMap, dispatch);
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