import { TAction } from '../utils/connect';
import { Channel } from '../../types/abema';
import { fetchAction } from '../utils/fetch-middleware';

export const fetchChannels = () => fetchAction('/api/broadcast/channels', 'CHANNELS');

type IFetchedChannels = TAction<'FETCH_RECEIVED_CHANNELS', Channel[]>;

export type Actions = IFetchedChannels;