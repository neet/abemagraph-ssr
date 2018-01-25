import * as React from 'react';

export const PageHeader = ({ text, children }: {text: string, children?: {} }) => <div className='page-header'>{children || null}<h3>{text}</h3></div>;