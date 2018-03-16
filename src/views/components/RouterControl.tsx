import * as React from 'react';
import { Route } from 'react-router';
import * as _ from 'lodash';
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
export const Meta = ({ property, content }) => (
    <Route render={({ staticContext }) => {
        if (staticContext)
            staticContext.meta[property] = content;
        return null;
    }} />
);
export const KeyValueMeta = ({ prefix, ...params }) => <>{_.map(params, (value, key) => <Meta key={key} property={prefix + key} content={value} />)}</>;
export const OgpMeta = ({ ...params }) => <KeyValueMeta prefix='ogp:' {...params} />;
export const SearchMeta = ({ ...params }) => <KeyValueMeta prefix='' {...params} />;
export const TwitterMeta = ({ ...params }) => <KeyValueMeta prefix='twitter:' {...params} />;