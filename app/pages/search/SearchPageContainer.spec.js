import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Loader from 'react-loader';
import { Link } from 'react-router';
import simple from 'simple-mock';

import { UnconnectedSearchPageContainer as SearchPageContainer } from './SearchPageContainer';
import SearchControls from './search-controls';

describe('pages/search/SearchPageContainer', () => {
  const defaultProps = {
    isFetching: false,
    fetchResources: () => null,
    resources: [],
    resultsCount: 0,
    searchFilters: { search: 'search text' },
  };

  function getWrapper(props) {
    return shallow(<SearchPageContainer {...defaultProps} {...props} />);
  }

  function getResultsCountWrapper(props) {
    return getWrapper(props).find('.search-results-count');
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
        expect(header.text()).to.equal('Hae tiloja');
      });

      it('renders SearchControls with correct props', () => {
        const searchControls = wrapper.find(SearchControls);
        expect(searchControls).to.have.length(1);
        expect(searchControls.prop('initialValues')).to.deep.equal(defaultProps.searchFilters);
      });

      it('renders a Link with correct props for each resource given in props', () => {
        const links = wrapper.find('ul').find(Link);

        expect(links).to.have.length(resources.length);
        links.forEach((link, index) => {
          const resource = resources[index];
          expect(link.prop('to')).to.equal(`/resources/${resource.id}`);
          expect(link.prop('children')).to.equal(resource.name.fi);
        });
      });

      describe('results count', () => {
        it('renders correct text if results is 0', () => {
          const resultsCount = getResultsCountWrapper();
          expect(resultsCount.text()).to.contain('Löytyi 0 hakuehdot täyttävää tilaa');
        });

        it('renders correct text if results is 1', () => {
          const resultsCount = getResultsCountWrapper({ resultsCount: 1 });
          expect(resultsCount.text()).to.contain('Löytyi 1 hakuehdot täyttävä tila');
        });

        it('renders correct text if results is greater than 1', () => {
          const resultsCount = getResultsCountWrapper({ resultsCount: 4 });
          expect(resultsCount.text()).to.contain('Löytyi 4 hakuehdot täyttävää tilaa');
        });

        it('renders a Link with correct props for clearing search results', () => {
          const resultsCount = getResultsCountWrapper();
          const link = resultsCount.find(Link);
          expect(link.prop('to')).to.equal('/');
          expect(link.prop('children')).to.equal('Tyhjennä haku.');
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

      it('renders SearchControls with correct props', () => {
        const searchControls = wrapper.find(SearchControls);
        expect(searchControls).to.have.length(1);
        expect(searchControls.prop('initialValues')).to.deep.equal(defaultProps.searchFilters);
      });
    });
  });

  describe('componentDidMount', () => {
    it('fetches resources using search filters', () => {
      const fetchResources = simple.mock();
      const instance = getWrapper({ fetchResources }).instance();
      instance.componentDidMount();
      expect(fetchResources.callCount).to.equal(1);
      expect(fetchResources.lastCall.arg).to.deep.equal(defaultProps.searchFilters);
    });
  });

  describe('componentWillUpdate', () => {
    describe('when searchFilters prop changes', () => {
      const fetchResources = simple.mock();
      const searchFilters = { search: 'search text' };
      const nextProps = { searchFilters: { search: 'new search' } };

      before(() => {
        const instance = getWrapper({ fetchResources, searchFilters }).instance();
        instance.state = searchFilters;
        instance.componentWillUpdate(nextProps);
      });

      it('fetches resources using search filters', () => {
        expect(fetchResources.callCount).to.equal(1);
        expect(fetchResources.lastCall.arg).to.deep.equal(nextProps.searchFilters);
      });
    });

    describe('when searchFilters prop does not change', () => {
      const fetchResources = simple.mock();
      const searchFilters = { search: 'search text' };
      const nextProps = { searchFilters };

      before(() => {
        const instance = getWrapper({ fetchResources, searchFilters }).instance();
        instance.state = searchFilters;
        instance.componentWillUpdate(nextProps);
      });

      it('does not fetch resources', () => {
        expect(fetchResources.callCount).to.equal(0);
      });
    });
  });
});
