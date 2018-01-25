import { combineReducers } from 'redux';
import { broadcast } from './broadcast';
import { Store } from '../constant/store';
import { app } from './app';

export default combineReducers<Store>({ app, broadcast });