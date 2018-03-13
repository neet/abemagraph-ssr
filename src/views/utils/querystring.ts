export const parse = (qs: string): { [key: string]: string } => {
    return qs.replace(/^\?/, '').split('&').reduce((obj, item) => {
        const [key, value] = item.split('=').map(s => decodeURI(s));
        obj[key] = value.replace('+', ' ');
        return obj;
    }, {});
};