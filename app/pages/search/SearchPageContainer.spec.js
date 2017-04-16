import { expect } from 'chai';
import { shallow } from 'enzyme';
import { camelizeKeys, decamelizeKeys } from 'humps';
import moment from 'moment';
import queryString from 'query-string';
import React from 'react';
import Loader from 'react-loader';
import { browserHistory, Link } from 'react-router';
import simple from 'simple-mock';

import AvailabilityView from 'shared/availability-view';
import ResourceDailyReportButton from 'shared/resource-daily-report-button';
import resourceSearchUtils from 'utils/resourceSearchUtils';
import {
  parseUrlFilters,
  UnconnectedSearchPageContainer as SearchPageContainer,
} from './SearchPageContainer';
import SearchControls from './search-controls';

describe('pages/search/SearchPageContainer', () => {
  const searchFilters = {
    availableStartDate: '2016-12-12',
    availableStartTime: '',
    availableEndDate: '2016-12-12',
    availableEndTime: '',
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
        expect(header.text()).to.equal('Tilat');
      });

      it('renders SearchControls with correct props', () => {
        const searchControls = wrapper.find(SearchControls);
        expect(searchControls).to.have.length(1);
        expect(searchControls.prop('values')).to.deep.equal(defaultProps.searchFilters);
        expect(searchControls.prop('equipment')).to.deep.equal(defaultProps.equipment);
        expect(searchControls.prop('types')).to.deep.equal(defaultProps.types);
        expect(searchControls.prop('units')).to.deep.equal(defaultProps.units);
        expect(searchControls.prop('onChange')).to.be.a('function');
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

      it('fetches resources using decamelized effective search filters', () => {
        expect(fetchResources.callCount).to.equal(1);
        const expectedArg = decamelizeKeys(
          resourceSearchUtils.getEffectiveFilters(searchFilters)
        );
        expect(fetchResources.lastCall.arg).to.deep.equal(expectedArg);
      });

      it('does not change filters', () => {
        expect(changeFilters.callCount).to.equal(0);
      });
    });

    describe('when query params in url', () => {
      it('changes filters using camelized query params', () => {
        const query = { is_favorite: 'true' };
        callComponentDidMount(query);
        expect(changeFilters.callCount).to.equal(1);
        const expectedArg = camelizeKeys(query);
        expect(changeFilters.lastCall.arg).to.deep.equal(expectedArg);
      });

      it('parses availableBetween param correctly', () => {
        const availableBetweenParams = {
          availableStartDate: '2016-12-13',
          availableStartTime: '09:00',
          availableEndDate: '2016-12-14',
          availableEndTime: '10:30',
        };
        const availableBetween = resourceSearchUtils.getAvailableBetween(
          availableBetweenParams.availableStartDate,
          availableBetweenParams.availableStartTime,
          availableBetweenParams.availableEndDate,
          availableBetweenParams.availableEndTime,
        );
        const query = {
          is_favorite: 'true',
          availableBetween,
        };
        callComponentDidMount(query);
        expect(changeFilters.callCount).to.equal(1);
        const expectedArg = {
          ...availableBetweenParams,
          isFavorite: 'true',
        };
        expect(changeFilters.lastCall.arg).to.deep.equal(expectedArg);
      });

      it('ignores invalid availableBetween param', () => {
        const query = {
          is_favorite: 'true',
          availableBetween: 'invalid',
        };
        callComponentDidMount(query);
        expect(changeFilters.callCount).to.equal(1);
        const expectedArg = {
          isFavorite: 'true',
        };
        expect(changeFilters.lastCall.arg).to.deep.equal(expectedArg);
      });

      it('does not fetch resources', () => {
        const query = { is_favorite: 'true' };
        callComponentDidMount(query);
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
      fetchMock = simple.mock(instance, 'fetchAndChangeUrl');
      throttledFetchMock = simple.mock(instance, 'throttledFetchAndChangeUrl');
    });

    afterEach(() => {
      simple.restore();
    });

    describe('when searchFilters prop changes', () => {
      it('calls fetchAndChangeUrl with search filters', () => {
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

    describe('when searchFilters change only uneffectively', () => {
      // availableEndTime remains empty so availableBetween doesn't change.
      const nextProps = {
        searchFilters: {
          ...searchFilters,
          availableStartTime: '12:30',
        },
      };

      it('does not fetch resources', () => {
        instance.componentWillUpdate(nextProps);
        expect(fetchMock.callCount).to.equal(0);
        expect(throttledFetchMock.callCount).to.equal(0);
      });
    });
  });

  describe('fetchAndChangeUrl', () => {
    let replaceUrlMock;

    beforeEach(() => {
      replaceUrlMock = simple.mock(browserHistory, 'replace');
    });

    afterEach(() => {
      simple.restore();
    });

    it('fetches resources with effective decamelized filters', () => {
      const fetchResources = simple.mock();
      const instance = getWrapper({ fetchResources }).instance();
      const filters = {
        isFavorite: 'true',
        search: 'search text',
      };
      instance.fetchAndChangeUrl(filters);

      expect(fetchResources.callCount).to.equal(1);
      expect(fetchResources.lastCall.arg).to.deep.equal({
        available_between: '',
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
      instance.fetchAndChangeUrl(filters);

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

  describe('parseUrlFilters', () => {
    it('parses regular filters correctly', () => {
      const query = {
        date: '2016-01-01',
        equipment: '123',
        isFavorite: 'true',
      };
      const actual = parseUrlFilters(query);
      expect(actual).to.deep.equal(query);
    });

    it('parses availableBetween correctly', () => {
      const availableStart = moment('2016-01-03 12:00').toISOString();
      const availableEnd = moment('2016-01-04 13:30').toISOString();
      const availableBetween = `${availableStart},${availableEnd}`;
      const query = {
        availableBetween,
        equipment: '123',
      };
      const expected = {
        availableStartDate: '2016-01-03',
        availableStartTime: '12:00',
        availableEndDate: '2016-01-04',
        availableEndTime: '13:30',
        equipment: '123',
      };
      const actual = parseUrlFilters(query);
      expect(actual).to.deep.equal(expected);
    });

    function expectAvailableBetweenIgnored(availableBetween) {
      const actual = parseUrlFilters({ availableBetween });
      expect(actual).to.deep.equal({});
    }

    it('ignores invalid availableBetween', () => {
      const availableStart = moment('2016-01-03 12:00').toISOString();
      expectAvailableBetweenIgnored(undefined);
      expectAvailableBetweenIgnored('');
      expectAvailableBetweenIgnored(`${availableStart}`);
      expectAvailableBetweenIgnored(`${availableStart},`);
      expectAvailableBetweenIgnored(`${availableStart},${availableStart},${availableStart}`);
      expectAvailableBetweenIgnored('invalid,invalid');
    });
  });
});
