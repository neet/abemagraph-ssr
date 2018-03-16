import * as React from 'react';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import { classname } from '../utils/classname';

export const NavLink = ({
    to,
    exact = true,
    className = '',
    children = null,
    disabled = false
}: {
        to: string,
        exact?: boolean,
        className?: string,
        children?: {},
        disabled?: boolean
    }) => <Route path={to} exact={exact} children={({ location, match }) => {
        const isActive = !!match;
        return (
            <li className={classname({ 'active': isActive, 'disabled': disabled })}>
                {disabled ? <a>{children}</a> : <Link to={to}>{children}</Link>}
            </li>
        );
    }} />;