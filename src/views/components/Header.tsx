import * as React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export const Header = () => (
    <header>
        <Navbar inverse fixedTop>
            <Navbar.Header>
                <Navbar.Brand>
                    <Link to='/'>AbemaGraph</Link>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav>
                    <LinkContainer to='/' exact>
                        <NavItem>トップページ</NavItem>
                    </LinkContainer>
                    <LinkContainer to='/all' exact>
                        <NavItem><Glyphicon glyph='stats' /> 全体統計</NavItem>
                    </LinkContainer>
                </Nav>
                <Nav pullRight>
                    <LinkContainer to='/status' exact>
                        <NavItem>ステータス</NavItem>
                    </LinkContainer>
                    <NavDropdown title='番組表' id='timetable'>
                        <LinkContainer to='/notifications' exact>
                            <MenuItem>通知リスト</MenuItem>
                        </LinkContainer>
                        <LinkContainer to='/timetable' exact>
                            <MenuItem><Glyphicon glyph='calendar' /> 番組表</MenuItem>
                        </LinkContainer>
                        <MenuItem divider />
                        <LinkContainer to='/search' exact>
                            <MenuItem><Glyphicon glyph='search' /> 検索</MenuItem>
                        </LinkContainer>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    </header>
);