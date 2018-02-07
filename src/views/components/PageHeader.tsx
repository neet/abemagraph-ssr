import * as React from 'react';

export const PageHeader = ({ text, children, mini }: { text: {}, children?: {} | null, mini?: boolean }) => <div className='page-header'>{children || null}{mini ? <h4>{text}</h4> : <h3>{text}</h3>}</div>;
