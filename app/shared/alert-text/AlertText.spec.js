import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import AlertText from './AlertText';

describe('shared/alert-text/AlertText', () => {
  const defaults = {
    text: 'Some warning.',
    type: 'warning',
  };

  function getWrapper(props) {
    return shallow(<AlertText {...defaults} {...props} />);
  }

  it('is div.alert-text', () => {
    expect(getWrapper().is('div.alert-text')).to.be.true;
  });

  it('has class based on type', () => {
    expect(getWrapper({ type: 'warning' }).hasClass('alert-text-warning')).to.be.true;
    expect(getWrapper({ type: 'error' }).hasClass('alert-text-error')).to.be.true;
  });

  it('renders text', () => {
    expect(getWrapper().contains(defaults.text)).to.be.true;
  });
});
