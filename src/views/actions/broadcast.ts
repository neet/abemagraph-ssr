import { Slot } from '../../types/abema';
import { BroadcastSlot } from '../../types/abemagraph';
import { fetchActionCreator } from '../utils/fetch-middleware';

export const broadcastFetch = fetchActionCreator<BroadcastSlot[]>('BROADCAST');
export const fetchBroadcastSlots = () => broadcastFetch.fetch('/api/broadcast');