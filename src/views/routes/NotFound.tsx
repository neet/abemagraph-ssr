import * as React from 'react';
import { StatusCode } from '../components/StatusCode';
import { PageHeader } from '../components/PageHeader';
import { Title } from '../components/Title';

export const NotFound = () => (
    <StatusCode code={404}>
        <Title title='404 Not Found - AbemaGraph' />
        <PageHeader text='404 Not Found' />
        <p>お探しのページは存在していません</p>
    </StatusCode>
);