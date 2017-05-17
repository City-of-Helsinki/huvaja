import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';
import Loader from 'react-loader';

import { ReservationCreateForm } from 'shared/reservation-form';
import { getState } from 'utils/testUtils';
import { UnconnectedReservationCreatePageContainer, selector } from './ReservationCreatePageContainer';

describe('pages/reservationCreate/ReservationCreatePageContainer', () => {
  const resources = {
    123: { id: '123' },
    234: { id: '234' },
  };
  const defaults = {
    isFetching: false,
    location: {
      query: {
        begin: '2016-03-15',
        resource: '123',
      },
    },
    resource: {
      id: '123',
    },
  };
  function getWrapper(props) {
    return shallow(<UnconnectedReservationCreatePageContainer {...defaults} {...props} />);
  }

  describe('selector', () => {
    function getSelected(extraState) {
      const state = getState({
        'data.resources': resources,
        ...extraState,
      });
      const props = { location: defaults.location };
      return selector(state, props);
    }

    it('returns resource', () => {
      expect(getSelected().resource).to.deep.equal(resources['123']);
    });

    describe('isFetching', () => {
      it('returns true if data.resources is empty', () => {
        const extraState = {
          'data.resources': {},
        };
        expect(getSelected(extraState).isFetching).to.be.true;
      });

      it('returns false if data.resources is not empty', () => {
        expect(getSelected().isFetching).to.be.false;
      });
    });
  });

  describe('render', () => {
    describe('Loader', () => {
      function getLoader(props) {
        return getWrapper(props).find(Loader);
      }

      it('is rendered', () => {
        expect(getLoader()).to.have.length(1);
      });

      it('is loaded when not fetching', () => {
        expect(getLoader().prop('loaded')).to.be.true;
      });

      it('is not loaded when fetching', () => {
        const props = { isFetching: true };
        expect(getLoader(props).prop('loaded')).to.be.false;
      });
    });

    describe('ReservationCreateForm', () => {
      it('is rendered with correct props', () => {
        const props = { location: { query: {
          begin: '2016-03-15T10:00.000',
          end: '2016-03-15T12:00.000',
        } } };
        const form = getWrapper(props).find(ReservationCreateForm);
        expect(form).to.have.length(1);
        expect(form.prop('initialResource')).to.deep.equal(defaults.resource);
        expect(form.prop('begin')).to.equal('2016-03-15T10:00.000');
        expect(form.prop('end')).to.equal('2016-03-15T12:00.000');
      });

      it('gets today as begin prop if begin param not in query', () => {
        const props = { location: { query: {} } };
        const form = getWrapper(props).find(ReservationCreateForm);
        const today = moment().format('YYYY-MM-DD');
        expect(form.prop('begin')).to.equal(today);
      });
    });
  });
});
