import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Glyphicon } from './Glyphicon';
import { Container } from './Container';

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
                        <li>
                            <NavLink to='/'>トップページ</NavLink>
                        </li>
                        <li>
                            <NavLink to='/all'><Glyphicon glyph='stats' /> 全体統計</NavLink>
                        </li>
                    </ul>
                    <ul className='nav navbar-nav navbar-right'>
                        <li>
                            <NavLink to='/status'>ステータス</NavLink>
                        </li>
                        <li className='dropdown'>
                            <a href='#' className='dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                                <Glyphicon glyph='calendar' /> 番組表
                                <span className='caret' />
                            </a>
                            <ul className='dropdown-menu'>
                                <li>
                                    <NavLink to='/notification'><Glyphicon glyph='bell' /> 通知</NavLink>
                                </li>
                                <li>
                                    <NavLink to='/timetable'><Glyphicon glyph='calendar' /> 番組表</NavLink>
                                </li>
                                <li className='divider' role='separator' />
                                <li>
                                    <NavLink to='/search'><Glyphicon glyph='search' /> 検索</NavLink>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </Container>
        </nav>
    </header>
);