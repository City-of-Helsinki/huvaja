import React, { PropTypes } from 'react';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Nav from 'react-bootstrap/lib/Nav';
import RBNavbar from 'react-bootstrap/lib/Navbar';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import NavItem from 'react-bootstrap/lib/NavItem';
import { IndexLink } from 'react-router';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';

function Navbar(props) {
  return (
    <RBNavbar inverse>
      <RBNavbar.Header>
        <RBNavbar.Brand>
          <IndexLink to="/">
            Huonevaraus
          </IndexLink>
        </RBNavbar.Brand>
        <RBNavbar.Toggle />
      </RBNavbar.Header>
      <RBNavbar.Collapse>
        <Nav className="links">
          <IndexLinkContainer to="/">
            <NavItem>Tilat</NavItem>
          </IndexLinkContainer>
          <LinkContainer to="/reservations">
            <NavItem>Varaukset</NavItem>
          </LinkContainer>
          <LinkContainer to="/reservations/create">
            <NavItem>Uusi varaus</NavItem>
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
      </RBNavbar.Collapse>
    </RBNavbar>
  );
}

Navbar.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }),
};

export default Navbar;
