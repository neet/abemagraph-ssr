import createActionFactory from 'typescript-fsa';

import { Slot } from '../../types/abema';
import { fetchActionCreator } from '../utils/fetch-middleware';
const createAction = createActionFactory();

export const slotApi = fetchActionCreator<Slot>('SLOT');
export const fetchSlot = (slotId: string) => slotApi.fetch(`/api/slots/${slotId}`);

export const slotLogsApi = fetchActionCreator<Array<[number, number, number]>>('SLOT_LOGS');
export const fetchSlotLogs = (slotId: string) => slotLogsApi.fetch(`/api/logs/${slotId}`);

export const invalidateSlot = createAction('INVALIDATE_SLOT');