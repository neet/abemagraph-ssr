import { combineReducers } from 'redux';
import { broadcast } from './broadcast';
import { Store } from '../constant/store';

export default combineReducers<Store>({ broadcast });