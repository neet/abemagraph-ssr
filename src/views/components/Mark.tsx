import * as React from 'react';
import { markName, MarkType } from '../constant/const';

export const Mark = ({ mark, showItem }: { mark: string[], showItem: MarkType[] }) =>
    <>{showItem.filter(m => mark.indexOf(m) >= 0).map(m => <mark key={m}>{markName[m]}</mark>)}</>;