import { combineReducers } from 'redux';
import { app } from './app';
import { Store } from '../constant/store';

export default combineReducers<Store>({ app });