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

const initialTag = document.getElementById('initial-data');
let initialState = {};
if (initialTag) {
    const initialJSON = initialTag.getAttribute('data-json');
    if (initialJSON)
        initialState = JSON.parse(initialJSON);
}
const store = createStore(reducers, initialState, applyMiddleware(thunk));

hydrate((
    <Provider store={store}>
        <Router>
            <Switch>
                <Routes />
            </Switch>
        </Router>
    </Provider>
), document.getElementById('app'));