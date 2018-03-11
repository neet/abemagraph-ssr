import * as React from 'react';

export const Checkbox = ({ label, checked, onChange }: {
    label: string,
    checked?: boolean,
    onChange?: (checked: boolean) => void
}) => <div className='checkbox'><label><input type='checkbox' checked={checked || false} onChange={e => (onChange || ((c) => { }))(e.target.checked)} />{label}</label></div>;