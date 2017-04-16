import React, { PropTypes } from 'react';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Nav from 'react-bootstrap/lib/Nav';
import RBNavbar from 'react-bootstrap/lib/Navbar';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import NavItem from 'react-bootstrap/lib/NavItem';
import { IndexLink } from 'react-router';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';

import Logo from 'shared/logo';

function Navbar(props) {
  return (
    <RBNavbar inverse>
      <RBNavbar.Header>
        <RBNavbar.Brand>
          <IndexLink to="/">
            <Logo />
            Huonevaraus
          </IndexLink>
        </RBNavbar.Brand>
      </RBNavbar.Header>
      <Nav className="links">
        <IndexLinkContainer to="/">
          <NavItem>Tilat</NavItem>
        </IndexLinkContainer>
        <LinkContainer to="/reservations">
          <NavItem>Varaukset</NavItem>
        </LinkContainer>
      </Nav>
      <Nav navbar pullRight>
        {!props.user &&
          <NavItem href="/login">Kirjaudu sisään</NavItem>
        }
        {props.user &&
          <NavDropdown id="collapsible-navbar-dropdown" title={props.user.displayName}>
            <MenuItem href={`/logout?next=${window.location.origin}`}>
              Kirjaudu ulos
            </MenuItem>
          </NavDropdown>
        }
      </Nav>
    </RBNavbar>
  );
}

Navbar.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }),
};

export default Navbar;
