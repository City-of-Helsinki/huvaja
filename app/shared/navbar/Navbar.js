import React from 'react';
import RBNavbar from 'react-bootstrap/lib/Navbar';
import { IndexLink } from 'react-router';

import Logo from 'shared/logo';


function Navbar() {
  return (
    <RBNavbar inverse>
      <RBNavbar.Header>
        <RBNavbar.Brand>
          <IndexLink to="/">
            <Logo />
            Huonevarausjärjestelmä
          </IndexLink>
        </RBNavbar.Brand>
      </RBNavbar.Header>
    </RBNavbar>
  );
}


Navbar.propTypes = {};

export default Navbar;
