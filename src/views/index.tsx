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
import { compose, Middleware } from 'redux';
import { fetchMiddleware } from './utils/fetch-middleware';
import * as Highstock from 'highcharts/highstock';

let initialState = {};
if (window['__INITIAL_STATE__']) {
    initialState = window['__INITIAL_STATE__'];
    delete window['__INITIAL_STATE__'];
}
const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
const store = createStore(reducers, initialState, composeEnhancers(applyMiddleware(fetchMiddleware as Middleware, thunk)));

Highstock.setOptions({
    global: {
        useUTC: false
    },
    lang: {
        numericSymbols: null
    },
    chart: {
        animation: false,
        panning: true,
    },
    plotOptions: {
        line: {
            animation: true,
            states: {
                hover: {
                    enabled: false
                }
            }
        }
    },
    legend: {
        enabled: false
    },
    xAxis: {
        dateTimeLabelFormats: {
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%m/%e %H:%M',
            day: '%y/%m/%e',
            week: '%y/%m/%e',
            month: '%Y/%m',
            year: '(%Y)'
        }
    },
    colors: ['#6fb900', '#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1']
});

hydrate((
    <Provider store={store}>
        <Router>
            <Routes />
        </Router>
    </Provider>
), document.getElementById('app'));