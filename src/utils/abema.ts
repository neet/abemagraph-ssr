import { request } from './request';

import Config from '../config';

export const api = async <T>(api: string, method: 'GET' | 'POST' = 'GET', params: { [key: string]: string } = {}): Promise<T> => {
    return (await request({
        url: `https://api.abema.io/v1/${api}`,
        [method === 'POST' ? 'body' : 'qs']: params,
        method,
        headers: {
            'Authorization': `Bearer ${Config.abema.token}`
        },
        gzip: true,
        json: true
    })).body as T;
};