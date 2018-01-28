import * as React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import { Routes } from './Routes';
import reducers from './reducers';

import 'moment/locale/ja';

import 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.styl';
import { compose } from 'redux';

let initialState = {};
if (window['__INITIAL_STATE__']) {
    initialState = window['__INITIAL_STATE__'];
    delete window['__INITIAL_STATE__'];
}
const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
const store = createStore(reducers, initialState, composeEnhancers(applyMiddleware(thunk)));

hydrate((
    <Provider store={store}>
        <Router>
            <Routes />
        </Router>
    </Provider>
), document.getElementById('app'));