import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import { UnconnectedSearchContainer as SearchContainer } from './SearchContainer';

describe('pages/search/SearchContainer', () => {
  function getWrapper(props) {
    const defaults = {
      message: 'Some message',
      fetchResources: simple.mock(),
    };
    return shallow(<SearchContainer {...defaults} {...props} />);
  }

  describe('render', () => {
    it('renders a header with correct text', () => {
      const message = 'Hello';
      const header = getWrapper({ message }).find('h1');
      expect(header.length).to.equal(1);
      expect(header.text()).to.equal('Project Hello');
    });
  });

  describe('componentDidMount', () => {
    it('fetches resources', () => {
      const fetchResources = simple.mock();
      const instance = getWrapper({ fetchResources }).instance();
      instance.componentDidMount();
      expect(fetchResources.callCount).to.equal(1);
    });
  });
});
