import { expect } from 'chai';
import { shallow } from 'enzyme';
import { camelizeKeys, decamelizeKeys } from 'humps';
import moment from 'moment';
import queryString from 'query-string';
import React from 'react';
import Loader from 'react-loader';
import { browserHistory, Link } from 'react-router';
import simple from 'simple-mock';

import DayReservation from './day-reservations';
import {
  parseUrlFilters,
  UnconnectedReservationSearchPageContainer as ReservationSearchPageContainer,
} from './ReservationSearchPageContainer';
import ReservationSearchControls from './reservation-search-controls';

describe('pages/search/ReservationSearchPageContainer', () => {
  const searchFilters = {
    end: '2016-12-12',
    eventSubject: '',
    hasCatering: '',
    hasEquipment: '',
    hostName: '',
    isFavoriteResource: '',
    isOwn: '',
    reserverName: '',
    resourceName: '',
    start: '2016-11-12',
    unit: '',
  };
  const defaultProps = {
    changeFilters: () => null,
    fetchReservations: () => null,
    isFetching: false,
    location: { query: {} },
    reservationGroups: [
      { day: moment('2016-11-12'), reservations: [1, 2] },
    ],
    resultsCount: 0,
    searchFilters,
    units: { 125: {} },
  };

  function getWrapper(props) {
    return shallow(<ReservationSearchPageContainer {...defaultProps} {...props} />);
  }

  function getResultsCountWrapper(props) {
    return getWrapper(props).find('.search-results-count');
  }

  describe('render', () => {
    describe('when reservations are fetched', () => {
      let wrapper;
      const isFetching = true;
      const reservations = [
        { id: 1, name: { fi: 'Varaus 1' } },
        { id: 2, name: { fi: 'Varaus 2' } },
      ];

      before(() => {
        wrapper = getWrapper({ isFetching, reservations });
      });

      it('renders a header with correct text', () => {
        const header = wrapper.find('h1');
        expect(header.length).to.equal(1);
        expect(header.text()).to.equal('Varaukset');
      });

      it('renders ReservationSearchControls with correct props', () => {
        const searchControls = wrapper.find(ReservationSearchControls);
        expect(searchControls).to.have.length(1);
        expect(searchControls.prop('values')).to.deep.equal(defaultProps.searchFilters);
        expect(searchControls.prop('units')).to.deep.equal(defaultProps.units);
        expect(searchControls.prop('onChange')).to.be.a('function');
      });

      it('renders DayReservations with correct props', () => {
        const dayReservations = wrapper.find(DayReservation);
        expect(dayReservations).to.have.length(1);

        const dayReservation = dayReservations.at(0);
        const group = defaultProps.reservationGroups[0];
        expect(dayReservation.prop('day')).to.equal(group.day);
        expect(dayReservation.prop('reservations')).to.equal(group.reservations);
      });

      describe('results count', () => {
        it('renders correct text if results is 0', () => {
          const resultsCount = getResultsCountWrapper();
          expect(resultsCount.text()).to.contain('Löytyi 0 hakuehdot täyttävää varausta');
        });

        it('renders correct text if results is 1', () => {
          const resultsCount = getResultsCountWrapper({ resultsCount: 1 });
          expect(resultsCount.text()).to.contain('Löytyi 1 hakuehdot täyttävä varaus');
        });

        it('renders correct text if results is greater than 1', () => {
          const resultsCount = getResultsCountWrapper({ resultsCount: 4 });
          expect(resultsCount.text()).to.contain('Löytyi 4 hakuehdot täyttävää varausta');
        });

        it('renders a Link with correct props for clearing search results', () => {
          const resultsCount = getResultsCountWrapper();
          const link = resultsCount.find(Link);
          expect(link.prop('to')).to.equal('/reservations');
          expect(link.prop('children')).to.equal('Tyhjennä haku.');
        });
      });
    });

    describe('when reservations are not fetched', () => {
      let wrapper;
      const isFetching = false;
      const reservationGroups = [];

      before(() => {
        wrapper = getWrapper({ isFetching, reservationGroups });
      });

      it('renders a Loader', () => {
        const loader = wrapper.find(Loader);
        expect(loader).to.have.length(1);
      });

      it('renders ReservationSearchControls with correct props', () => {
        const searchControls = wrapper.find(ReservationSearchControls);
        expect(searchControls).to.have.length(1);
        expect(searchControls.prop('values')).to.deep.equal(defaultProps.searchFilters);
        expect(searchControls.prop('units')).to.deep.equal(defaultProps.units);
        expect(searchControls.prop('onChange')).to.be.a('function');
      });
    });
  });

  describe('componentDidMount', () => {
    let changeFilters;
    let fetchReservations;

    beforeEach(() => {
      changeFilters = simple.mock();
      fetchReservations = simple.mock();
    });

    afterEach(() => {
      simple.restore();
    });

    function callComponentDidMount(query) {
      const props = {
        changeFilters,
        fetchReservations,
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

      it('fetches reservations using decamelized filters', () => {
        expect(fetchReservations.callCount).to.equal(1);
        const expectedArg = decamelizeKeys(searchFilters);
        expect(fetchReservations.lastCall.arg).to.deep.equal(expectedArg);
      });

      it('does not change filters', () => {
        expect(changeFilters.callCount).to.equal(0);
      });
    });

    describe('when query params in url', () => {
      it('changes filters using camelized query params', () => {
        const query = { is_favorite_resource: 'true' };
        callComponentDidMount(query);
        expect(changeFilters.callCount).to.equal(1);
        const expectedArg = camelizeKeys(query);
        expect(changeFilters.lastCall.arg).to.deep.equal(expectedArg);
      });

      it('does not fetch reservations', () => {
        const query = { is_favorite_resource: 'true' };
        callComponentDidMount(query);
        expect(fetchReservations.callCount).to.equal(0);
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
            start: '2016-12-13',
          },
        };
        instance.componentWillUpdate(nextProps);
        expect(fetchMock.callCount).to.equal(1);
        expect(fetchMock.lastCall.arg).to.deep.equal(nextProps.searchFilters);
        expect(throttledFetchMock.callCount).to.equal(0);
      });

      it('uses throttledFetch when text field changes', () => {
        const nextProps = {
          searchFilters: {
            ...searchFilters,
            eventSubject: 'Meeting',
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

      it('does not fetch reservations', () => {
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

    it('fetches reservations with decamelized filters', () => {
      const fetchReservations = simple.mock();
      const instance = getWrapper({ fetchReservations }).instance();
      const filters = {
        isFavoriteResource: 'true',
        eventSubject: 'Meeting',
      };
      instance.fetchAndChangeUrl(filters);

      expect(fetchReservations.callCount).to.equal(1);
      expect(fetchReservations.lastCall.arg).to.deep.equal({
        is_favorite_resource: 'true',
        event_subject: 'Meeting',
      });
    });

    it('replaces url with correct filters', () => {
      const fetchReservations = simple.mock();
      const instance = getWrapper({ fetchReservations }).instance();
      const filters = {
        isFavoriteResource: 'true',
        eventSubject: 'Meeting',
      };
      instance.fetchAndChangeUrl(filters);

      const expectedFilters = decamelizeKeys(filters);
      const expectedPath = `/reservations?${queryString.stringify(expectedFilters)}`;
      expect(replaceUrlMock.callCount).to.equal(1);
      expect(replaceUrlMock.lastCall.arg).to.equal(expectedPath);
    });
  });

  describe('parseUrlFilters', () => {
    it('parses filters correctly', () => {
      const query = {
        start: '2016-01-01',
        is_favorite_resource: 'true',
      };
      const actual = parseUrlFilters(query);
      const expected = camelizeKeys(query);
      expect(actual).to.deep.equal(expected);
    });
  });
});
