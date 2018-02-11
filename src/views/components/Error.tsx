import * as React from 'react';
import { PageHeader } from '../components/PageHeader';

const messages = {
    404: '指定されたページは存在していません',
    600: '読み込みに失敗しました',
    default: '要求されたページを表示中にエラーが発生しました'
};

export const ErrorPage = ({ code }: { code?: number }) => (
    <>
        <PageHeader text='エラーが発生しました' />
        <p>{messages[code || 'default']}</p>
    </>
);