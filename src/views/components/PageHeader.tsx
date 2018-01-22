import * as React from 'react';

export const PageHeader = ({ text, children }) => <div className='page-header'>{children}<h3>{text}</h3></div>;