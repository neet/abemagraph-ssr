import * as React from 'react';
import { PageHeader } from '../components/PageHeader';

export const ErrorPage = () => (
    <>
        <PageHeader text='エラーが発生しました' />
        <p>要求されたページを表示中にエラーが発生しました</p>
    </>
);