import { combineReducers } from 'redux';
import { broadcast } from './broadcast';
import { Store } from '../constant/store';
import { app } from './app';
import { slot } from './slot';
import { all } from './all';
import { search } from './search';

export default combineReducers<Store>({ app, broadcast, slot, all, search });