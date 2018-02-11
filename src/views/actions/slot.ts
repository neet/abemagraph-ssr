import { createAction } from 'redux-actions';

import { Slot } from '../../types/abema';
import { TAction } from '../utils/connect';
import { fetchAction, FetchFailedMeta } from '../utils/fetch-middleware';
import { INVALIDATE_SLOT } from '../constant/actions';

export const fetchSlot = (slotId: string) => fetchAction(`/api/slots/${slotId}`, 'SLOT');

export type IReceiveSlot = TAction<'FETCH_RECEIVED_SLOT', Slot>;
export type IRequestSlot = TAction<'FETCH_REQUEST_SLOT', void>;
export type IFailedFetchSlot = TAction<'FETCH_FAILED_SLOT', void, FetchFailedMeta>;

export const fetchSlotLogs = (slotId: string) => fetchAction(`/api/logs/${slotId}`, 'SLOT_LOGS');

export type IReceiveSlotLogs = TAction<'FETCH_RECEIVED_SLOT_LOGS', Array<[number, number, number]>>;
export type IRequestSlotLogs = TAction<'FETCH_REQUEST_SLOT_LOGS', void>;
export type IFailedFetchSlotLogs = TAction<'FETCH_FAILED_SLOT_LOGS', void, FetchFailedMeta>;

export const invalidateSlot = createAction(INVALIDATE_SLOT);
type IInvalidateSlot = TAction<typeof INVALIDATE_SLOT, void>;

export type Actions = IReceiveSlot | IRequestSlot | IFailedFetchSlot | IInvalidateSlot | IReceiveSlotLogs | IRequestSlotLogs | IFailedFetchSlotLogs;