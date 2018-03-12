import createActionFactory from 'typescript-fsa';

import { Slot } from '../../types/abema';
import { fetchActionCreator } from '../utils/fetch-middleware';
import { INVALIDATE_SLOT } from '../constant/actions';
const createAction = createActionFactory();

export const slotFetch = fetchActionCreator<Slot>('SLOT');
export const fetchSlot = (slotId: string) => slotFetch.fetch(`/api/slots/${slotId}`);

export const slotLogsFetch = fetchActionCreator<Array<[number, number, number]>>('SLOT_LOGS');
export const fetchSlotLogs = (slotId: string) => slotLogsFetch.fetch(`/api/logs/${slotId}`);

export const invalidateSlot = createAction(INVALIDATE_SLOT);