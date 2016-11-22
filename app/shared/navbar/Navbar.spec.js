import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { IndexLink } from 'react-router';

import Logo from 'shared/logo';
import Navbar from './Navbar';

describe('shared/navbar/Navbar', () => {
  const defaultProps = {};
  function getWrapper(props) {
    return shallow(<Navbar {...defaultProps} {...props} />);
  }

  describe('basic rendering', () => {
    let navbar;
    let homePageLink;
    before(() => {
      navbar = getWrapper();
      homePageLink = navbar.find(IndexLink);
    });

    it('renders the navbar', () => {
      expect(navbar).to.have.length(1);
    });

    it('renders a link to home page', () => {
      expect(homePageLink).to.have.length(1);
      expect(homePageLink.prop('to')).to.equal('/');
    });

    it('displays the logo of the service', () => {
      expect(homePageLink.find(Logo)).to.have.length(1);
    });

    it('displays the title of the service', () => {
      expect(homePageLink.html()).to.contain('Huonevarausjärjestelmä');
    });
  });
});
