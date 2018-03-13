import { Channel } from '../../types/abema';
import { fetchActionCreator } from '../utils/fetch-middleware';

export const channelsApi = fetchActionCreator<Channel[]>('CAHNNELS');
export const fetchChannels = () => channelsApi.fetch('/api/channels');