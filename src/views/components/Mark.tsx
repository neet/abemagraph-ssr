import * as React from 'react';

const markName = {
    'first': '初',
    last: '終',
    live: '生',
    bingeWatching: '一挙',
    recommendation: '注目',
    drm: 'DRM',
    newcomer: '新'
};

export const Mark = ({ mark, showItem }: { mark: string[], showItem: string[] }) =>
    <React.Fragment>{showItem.filter(m => mark.indexOf(m) >= 0).map(m => <mark key={m}>{markName[m]}</mark>)}</React.Fragment>;