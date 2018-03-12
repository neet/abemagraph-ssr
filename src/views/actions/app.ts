import { Channel } from '../../types/abema';
import { fetchActionCreator } from '../utils/fetch-middleware';

export const channelsFetch = fetchActionCreator<Channel[]>('CAHNNELS');
export const fetchChannels = () => channelsFetch.fetch('/api/channels');