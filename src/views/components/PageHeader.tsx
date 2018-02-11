import * as React from 'react';

export const PageHeader = ({ text, children, mini }: { text: {}, children?: {} | null, mini?: boolean }) => <div className='page-header'>{children || null}{React.createElement(mini ? 'h4' : 'h3', {}, text)}</div>;
