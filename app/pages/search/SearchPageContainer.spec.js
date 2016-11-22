import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Loader from 'react-loader';
import { Link } from 'react-router';
import simple from 'simple-mock';

import { UnconnectedSearchPageContainer as SearchPageContainer } from './SearchPageContainer';

describe('pages/search/SearchPageContainer', () => {
  function getWrapper(props) {
    const defaults = {
      isFetching: false,
      fetchResources: simple.mock(),
      resources: [],
    };
    return shallow(<SearchPageContainer {...defaults} {...props} />);
  }

  describe('render', () => {
    describe('when resources are fetched', () => {
      let wrapper;
      const isFetching = true;
      const resources = [
        { id: 'r-1', name: { fi: 'Resurssi 1' } },
        { id: 'r-2', name: { fi: 'Resurssi 2' } },
      ];

      before(() => {
        wrapper = getWrapper({ isFetching, resources });
      });

      it('renders a header with correct text', () => {
        const header = wrapper.find('h1');
        expect(header.length).to.equal(1);
        expect(header.text()).to.equal('Tilat');
      });

      it('renders a Link with correct props for each resource given in props', () => {
        const links = wrapper.find(Link);

        expect(links).to.have.length(resources.length);
        links.forEach((link, index) => {
          const resource = resources[index];
          expect(link.prop('to')).to.equal(`/resources/${resource.id}`);
          expect(link.prop('children')).to.equal(resource.name.fi);
        });
      });
    });

    describe('when resources are not fetched', () => {
      let wrapper;
      const isFetching = false;
      const resources = [];

      before(() => {
        wrapper = getWrapper({ isFetching, resources });
      });

      it('renders a Loader', () => {
        const loader = wrapper.find(Loader);
        expect(loader).to.have.length(1);
      });
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
