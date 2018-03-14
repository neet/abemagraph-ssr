import { Slot } from '../../types/abema';
import { BroadcastSlot } from '../../types/abemagraph';
import { fetchActionCreator } from '../utils/fetch-middleware';

export const broadcastApi = fetchActionCreator<BroadcastSlot[]>('BROADCAST');
export const fetchBroadcastSlots = () => broadcastApi.fetch('/api/broadcast');