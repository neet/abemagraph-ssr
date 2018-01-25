import * as React from 'react';
import { PageHeader } from '../components/PageHeader';
import { StatusCode, Title } from '../components/RouterControl';

export const NotFound = () => (
    <React.Fragment>
        <StatusCode code={404} />
        <Title title='404 Not Found - AbemaGraph' />
        <PageHeader text='404 Not Found' />
        <p>お探しのページは存在していません</p>
    </React.Fragment>
);