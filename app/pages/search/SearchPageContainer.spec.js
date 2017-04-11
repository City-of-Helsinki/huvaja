import { expect } from 'chai';
import { shallow } from 'enzyme';
import { camelizeKeys, decamelizeKeys } from 'humps';
import queryString from 'query-string';
import React from 'react';
import Loader from 'react-loader';
import { browserHistory, Link } from 'react-router';
import simple from 'simple-mock';

import AvailabilityView from 'shared/availability-view';
import ResourceDailyReportButton from 'shared/resource-daily-report-button';
import { UnconnectedSearchPageContainer as SearchPageContainer } from './SearchPageContainer';
import SearchControls from './search-controls';

describe('pages/search/SearchPageContainer', () => {
  const searchFilters = {
    date: '2016-12-12',
    equipment: '',
    isFavorite: '',
    people: '',
    search: 'search text',
    type: '',
    unit: '',
  };
  const defaultProps = {
    availabilityGroups: [
      { name: 'Group 1', resources: ['r-1', 'r-2'] },
    ],
    changeFilters: () => null,
    equipment: { 123: {} },
    isFetching: false,
    fetchResources: () => null,
    location: { query: {} },
    resultsCount: 0,
    searchFilters,
    types: { 124: {} },
    units: { 125: {} },
  };

  function getWrapper(props) {
    return shallow(<SearchPageContainer {...defaultProps} {...props} />);
  }

  function getResultsCountWrapper(props) {
    return getWrapper(props).find('.search-results-count');
  }

  function getReportButtonWrapper(props) {
    return getWrapper(props).find(ResourceDailyReportButton);
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
        expect(searchControls.prop('values')).to.deep.equal(defaultProps.searchFilters);
        expect(searchControls.prop('equipment')).to.deep.equal(defaultProps.equipment);
        expect(searchControls.prop('types')).to.deep.equal(defaultProps.types);
        expect(searchControls.prop('units')).to.deep.equal(defaultProps.units);
        expect(searchControls.prop('onChange')).to.deep.equal(defaultProps.changeFilters);
      });

      it('renders AvailabilityView with correct props', () => {
        const availabilityView = wrapper.find(AvailabilityView);
        expect(availabilityView).to.have.length(1);
        expect(availabilityView.prop('groups')).to.deep.equal(defaultProps.availabilityGroups);
        expect(availabilityView.prop('onDateChange')).to.equal(wrapper.instance().handleDateChange);
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

      describe('ResourceDailyReportButton', () => {
        it('is rendered', () => {
          expect(getReportButtonWrapper()).to.have.length(1);
        });

        it('gets the selected date', () => {
          expect(getReportButtonWrapper().prop('date')).to.equal('2016-12-12');
        });

        it('gets the availabilityGroups resourcesIds', () => {
          expect(getReportButtonWrapper().prop('resourceIds')).to.deep.equal(['r-1', 'r-2']);
        });

        it('gets resourcesIds from diferent availabilityGroups', () => {
          expect(getReportButtonWrapper({
            availabilityGroups: [
              { name: 'Group 1', resources: ['r-1', 'r-2'] },
              { name: 'Group 2', resources: ['r-3', 'r-4'] },
            ],
          }).prop('resourceIds')).to.deep.equal(['r-1', 'r-2', 'r-3', 'r-4']);
        });
      });
    });

    describe('when resources are not fetched', () => {
      let wrapper;
      const isFetching = false;
      const availabilityGroups = [];

      before(() => {
        wrapper = getWrapper({ isFetching, availabilityGroups });
      });

      it('renders a Loader', () => {
        const loader = wrapper.find(Loader);
        expect(loader).to.have.length(1);
      });

      it('renders SearchControls with correct props', () => {
        const searchControls = wrapper.find(SearchControls);
        expect(searchControls).to.have.length(1);
        expect(searchControls.prop('values')).to.deep.equal(searchFilters);
      });

      describe('ResourceDailyReportButton', () => {
        it('is not rendered', () => {
          expect(getReportButtonWrapper({ isFetching, availabilityGroups })).to.have.length(0);
        });
      });
    });
  });

  describe('componentDidMount', () => {
    let changeFilters;
    let fetchResources;

    beforeEach(() => {
      changeFilters = simple.mock();
      fetchResources = simple.mock();
    });

    afterEach(() => {
      simple.restore();
    });

    function callComponentDidMount(query) {
      const props = {
        changeFilters,
        fetchResources,
        location: { query },
      };
      const instance = getWrapper(props).instance();
      instance.componentDidMount();
    }

    describe('when no query params in url', () => {
      const query = {};

      beforeEach(() => {
        callComponentDidMount(query);
      });

      it('fetches resources using decamelized search filters', () => {
        expect(fetchResources.callCount).to.equal(1);
        const expectedArg = decamelizeKeys(searchFilters);
        expect(fetchResources.lastCall.arg).to.deep.equal(expectedArg);
      });

      it('does not change filters', () => {
        expect(changeFilters.callCount).to.equal(0);
      });
    });

    describe('when query params in url', () => {
      const query = { is_favorite: 'true' };

      beforeEach(() => {
        callComponentDidMount(query);
      });

      it('changes filters using camelized query params', () => {
        expect(changeFilters.callCount).to.equal(1);
        const expectedArg = camelizeKeys(query);
        expect(changeFilters.lastCall.arg).to.deep.equal(expectedArg);
      });

      it('does not fetch resources', () => {
        expect(fetchResources.callCount).to.equal(0);
      });
    });
  });

  describe('componentWillUpdate', () => {
    let instance;
    let fetchMock;
    let throttledFetchMock;

    beforeEach(() => {
      instance = getWrapper({ searchFilters }).instance();
      fetchMock = simple.mock(instance, 'fetch');
      throttledFetchMock = simple.mock(instance, 'throttledFetch');
    });

    afterEach(() => {
      simple.restore();
    });

    describe('when searchFilters prop changes', () => {
      it('fetches resources using search filters', () => {
        const nextProps = {
          searchFilters: {
            ...searchFilters,
            date: '2016-12-13',
          },
        };
        instance.componentWillUpdate(nextProps);
        expect(fetchMock.callCount).to.equal(1);
        expect(fetchMock.lastCall.arg).to.deep.equal(nextProps.searchFilters);
        expect(throttledFetchMock.callCount).to.equal(0);
      });

      it('uses throttledFetch when search field changes', () => {
        const nextProps = {
          searchFilters: {
            ...searchFilters,
            search: 'new search',
          },
        };
        instance.componentWillUpdate(nextProps);
        expect(throttledFetchMock.callCount).to.equal(1);
        expect(throttledFetchMock.lastCall.arg).to.deep.equal(nextProps.searchFilters);
        expect(fetchMock.callCount).to.equal(0);
      });
    });

    describe('when searchFilters prop does not change', () => {
      const nextProps = { searchFilters };

      it('does not fetch resources', () => {
        instance.componentWillUpdate(nextProps);
        expect(fetchMock.callCount).to.equal(0);
        expect(throttledFetchMock.callCount).to.equal(0);
      });
    });
  });

  describe('fetch', () => {
    let replaceUrlMock;

    beforeEach(() => {
      replaceUrlMock = simple.mock(browserHistory, 'replace');
    });

    afterEach(() => {
      simple.restore();
    });

    it('fetches resources with decamelized filters', () => {
      const fetchResources = simple.mock();
      const instance = getWrapper({ fetchResources }).instance();
      const filters = {
        isFavorite: 'true',
        search: 'search text',
      };
      instance.fetch(filters);

      expect(fetchResources.callCount).to.equal(1);
      expect(fetchResources.lastCall.arg).to.deep.equal({
        is_favorite: 'true',
        search: 'search text',
      });
    });

    it('replaces url with correct filters', () => {
      const fetchResources = simple.mock();
      const instance = getWrapper({ fetchResources }).instance();
      const filters = {
        isFavorite: 'true',
        search: 'search text',
      };
      instance.fetch(filters);

      const expectedFilters = decamelizeKeys(filters);
      const expectedPath = `/?${queryString.stringify(expectedFilters)}`;
      expect(replaceUrlMock.callCount).to.equal(1);
      expect(replaceUrlMock.lastCall.arg).to.equal(expectedPath);
    });
  });

  describe('handleDateChange', () => {
    it('calls changeFilters with new date', () => {
      const newDate = '2016-12-13';
      const changeFilters = simple.mock();
      const instance = getWrapper({ changeFilters, searchFilters }).instance();
      instance.handleDateChange(newDate);

      expect(changeFilters.callCount).to.equal(1);
      expect(changeFilters.lastCall.arg).to.deep.equal({
        ...searchFilters,
        date: newDate,
      });
      simple.restore();
    });
  });
});
