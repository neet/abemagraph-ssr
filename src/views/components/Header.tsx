import * as React from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon } from './Glyphicon';
import { Container } from './Container';
import { NavLink } from './NavLink';

export const Header = () => (
    <header>
        <nav className='navbar navbar-inverse navbar-fixed-top'>
            <Container>
                <div className='navbar-header'>
                    <button className='navbar-toggle' data-toggle='collapse' data-target='#navbar-main'>
                        <span className='icon-bar' />
                        <span className='icon-bar' />
                        <span className='icon-bar' />
                    </button>
                    <Link to='/' className='navbar-brand'>AbemaGraph</Link>
                </div>
                <div className='collapse navbar-collapse' id='navbar-main'>
                    <ul className='nav navbar-nav'>
                        <NavLink to='/'>トップページ</NavLink>
                        <NavLink to='/all'><Glyphicon glyph='stats' /> 全体統計</NavLink>
                    </ul>
                    <ul className='nav navbar-nav navbar-right'>
                        <li className='dropdown'>
                            <a href='#' className='dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                                <Glyphicon glyph='calendar' /> 番組表
                                <span className='caret' />
                            </a>
                            <ul className='dropdown-menu'>
                                <NavLink to='/notification' disabled><Glyphicon glyph='bell' /> 通知</NavLink>
                                <li><a href='/timetable'><Glyphicon glyph='calendar' /> 番組表</a></li>
                                <li className='divider' role='separator' />
                                <NavLink to='/search'><Glyphicon glyph='search' /> 検索</NavLink>
                            </ul>
                        </li>
                    </ul>
                </div>
            </Container>
        </nav>
    </header>
);