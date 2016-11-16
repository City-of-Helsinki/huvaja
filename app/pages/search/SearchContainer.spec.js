import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import { UnconnectedSearchContainer as SearchContainer } from './SearchContainer';

describe('pages/search/SearchContainer', () => {
  function getWrapper(props) {
    const defaults = {
      message: 'Some message',
    };
    return shallow(<SearchContainer {...defaults} {...props} />);
  }

  it('renders a header with correct text', () => {
    const message = 'Hello';
    const header = getWrapper({ message }).find('h1');
    expect(header.length).to.equal(1);
    expect(header.text()).to.equal('Project Hello');
  });
});
