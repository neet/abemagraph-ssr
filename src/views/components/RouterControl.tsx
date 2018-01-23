import * as React from 'react';
import { Route } from 'react-router';
import { isClient } from '../utils/ssr';

export const Title = ({ title }) => (
    <Route render={({ staticContext }) => {
        if (staticContext)
            staticContext.title = title;
        else if (isClient)
            document.title = title;
        return null;
    }} />
);
export const StatusCode = ({ code }) => (
    <Route render={({ staticContext }) => {
        if (staticContext)
            staticContext.status = code;
        return null;
    }} />
);