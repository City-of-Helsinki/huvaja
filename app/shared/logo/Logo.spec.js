import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import Logo from './Logo';
import helsinkiLogoSrc from './helsinki-coat-of-arms-white.png';

describe('shared/logo/Logo', () => {
  function getWrapper() {
    return shallow(<Logo />);
  }
  let logo;

  before(() => {
    logo = getWrapper();
  });

  it('renders logo of Helsinki', () => {
    expect(logo.type()).to.equal('img');
    expect(logo.props().src).to.equal(helsinkiLogoSrc);
  });

  it('renders Helsinki alt text', () => {
    expect(logo.props().alt).to.equal('Helsingin vaakuna');
  });
});
