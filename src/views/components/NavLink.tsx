import * as React from 'react';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';

export const NavLink = ({
    to,
    exact = true,
    className = '',
    children = null
}: {
        to: string,
        exact?: boolean,
        className?: string,
        children?: {}
    }) => <Route path={to} exact={exact} children={({ location, match }) => {
        const isActive = !!match;
        return (
            <li className={isActive ? 'active ' + className : className}>
                <Link to={to}>{children}</Link>
            </li>
        );
    }} />;