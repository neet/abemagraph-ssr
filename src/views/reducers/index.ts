import { combineReducers } from 'redux';
import { Store } from '../constant/store';
import { app } from './app';

export default combineReducers<Store>({ app });