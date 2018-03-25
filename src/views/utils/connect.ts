import { connect as reduxConnect, ActionCreator } from 'react-redux';
import { bindActionCreators, Dispatch, ActionCreatorsMapObject, AnyAction } from 'redux';
import * as _ from 'lodash';

import actions from '../actions';
import { Store } from '../constant/store';

interface ActionMap {
    [key: string]: Function | ActionMap;
}

export interface ActionProps {
    actions: typeof actions;
}

export type ReduxProps<T> = ActionProps & T;

const bind = (actionMap: ActionMap | ActionCreator<{}>, dispatch: Dispatch<{}>) =>
    _.mapValues(actionMap, action =>
        typeof action === 'function' ? bindActionCreators(action, dispatch) : bind(action, dispatch));

export function connect<TOwnProps = {},
    TImplProps = {},
    TStateProps = Store>(
        mapStateToProps: {
            [P in keyof TOwnProps]: (state: TStateProps) => TOwnProps[P]
        }) {
    return reduxConnect<TOwnProps, ActionProps>(
        (state: TStateProps): TOwnProps => {
            // tslint:disable-next-line:no-any
            return _.mapValues<any, any>(mapStateToProps, mapStateToProp => mapStateToProp(state)) as TOwnProps;
        },
        dispatch => bind({ actions }, dispatch)
    );
}