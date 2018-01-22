import * as React from 'react';
import { Route } from 'react-router';

export const StatusCode = ({ code, children }) => (
    <Route render={({ staticContext }) => {
        if (staticContext)
            staticContext.status = code;
        return children;
    }} />
);