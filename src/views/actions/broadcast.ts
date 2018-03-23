import createActionFactory from 'typescript-fsa';

import { Slot } from '../../types/abema';
import { BroadcastSlot, BroadcastSortType } from '../../types/abemagraph';
import { fetchActionCreator } from '../utils/fetch-middleware';

const createAction = createActionFactory('BROADCAST');
export const broadcastApi = fetchActionCreator<BroadcastSlot[]>('BROADCAST');
export const fetchBroadcastSlots = () => broadcastApi.fetch('/api/broadcast');
export const setSortType = createAction<BroadcastSortType>('SET_SORT_TYPE');