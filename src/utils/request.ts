import * as requestOriginal from 'request';

export function request(options: requestOriginal.RequiredUriUrl & requestOriginal.CoreOptions) {
    return new Promise<requestOriginal.RequestResponse>((resolve, reject) => requestOriginal(options, (err, res) => {
        if (err || res.statusCode !== 200)
            reject(err || res);
        else
            resolve(res);
    }));
}