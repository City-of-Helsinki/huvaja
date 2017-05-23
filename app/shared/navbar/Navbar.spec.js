import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import RBNavbar from 'react-bootstrap/lib/Navbar';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import NavItem from 'react-bootstrap/lib/NavItem';
import { IndexLink } from 'react-router';

import Navbar from './Navbar';

describe('shared/navbar/Navbar', () => {
  function getWrapper(props) {
    const defaults = { user: null };
    return shallow(<Navbar {...defaults} {...props} />);
  }

  function getLoginLinkWrapper(props) {
    return getWrapper(props).find('[href="/login"]');
  }

  function getLogoutLinkWrapper(props) {
    const logoutHref = `/logout?next=${window.location.origin}`;
    return getWrapper(props).find(`[href="${logoutHref}"]`);
  }

  it('renders react-bootstrap Navbar', () => {
    const navbar = getWrapper().find(RBNavbar);
    expect(navbar).to.have.length(1);
  });

  describe('home page link', () => {
    function getHomeLinkWrapper(props) {
      return getWrapper(props).find(IndexLink);
    }

    it('is rendered', () => {
      const homeLink = getHomeLinkWrapper();
      expect(homeLink).to.have.length(1);
      expect(homeLink.prop('to')).to.equal('/');
    });

    it('displays the title of the service', () => {
      expect(getHomeLinkWrapper().html()).to.contain('Huonevaraus');
    });
  });

  describe('links container', () => {
    function getPageLinksWrapper(props) {
      return getWrapper(props).find('.links');
    }

    it('is rendered', () => {
      const links = getPageLinksWrapper();
      expect(links).to.have.length(1);
    });

    function testLinkAt(index, href, text) {
      const links = getPageLinksWrapper();
      const link = links.children().at(index);
      expect(link.prop('to')).to.equal(href);
      const linkText = link.find(NavItem).children().text();
      expect(linkText).to.equal(text);
    }

    it('contains link to resource search page', () => {
      testLinkAt(0, '/', 'Tilat');
    });

    it('contains link to reservation search page', () => {
      testLinkAt(1, '/reservations', 'Varaukset');
    });

    it('contains link to create reservation page', () => {
      testLinkAt(2, '/reservations/create', 'Uusi varaus');
    });
  });

  describe('if user is logged in', () => {
    const user = { displayName: 'Luke Skywalker' };

    it('renders user\'s displayName in NavDropdown', () => {
      const navDropdown = getWrapper({ user }).find(NavDropdown);
      expect(navDropdown).to.have.length(1);
      expect(navDropdown.prop('title')).to.equal(user.displayName);
    });

    it('renders a logout link', () => {
      const logoutLink = getLogoutLinkWrapper({ user });
      expect(logoutLink).to.have.length(1);
    });

    it('does not render a login link', () => {
      const loginLink = getLoginLinkWrapper({ user });
      expect(loginLink).to.have.length(0);
    });
  });

  describe('if user is not logged in', () => {
    const user = null;

    it('renders a login link', () => {
      const loginLink = getLoginLinkWrapper({ user });
      expect(loginLink).to.have.length(1);
    });

    it('does not render a logout link', () => {
      const logoutLink = getLogoutLinkWrapper({ user });
      expect(logoutLink).to.have.length(0);
    });
  });
});
