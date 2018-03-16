import * as React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import * as $ from 'jquery';

import { Routes } from './Routes';
import reducers from './reducers';

import 'moment/locale/ja';
import 'whatwg-fetch';
import 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.styl';
import 'react-datetime/css/react-datetime.css';
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

require('highcharts/modules/exporting')(Highstock);
require('highcharts/modules/offline-exporting')(Highstock);

Highstock.setOptions({
    global: {
        useUTC: false
    },
    lang: {
        shortMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => n + '月'),
        weekdays: '日月火水木金土'.split('').map(n => n + '曜日')
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
    tooltip: {
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
    colors: ['#6fb900', '#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
    exporting: {
        printMaxWidth: 0xffff,
        fallbackToExportServer: false,
        sourceWidth: 2000,
        sourceHeight: 1000
    }
});

$(document).on('click', '.navbar-collapse a:not(.dropdown-toggle)', () => $('.navbar-toggle:visible').trigger('click'));
hydrate((
    <Provider store={store}>
        <Router>
            <Route component={Routes} />
        </Router>
    </Provider>
), document.getElementById('app'));