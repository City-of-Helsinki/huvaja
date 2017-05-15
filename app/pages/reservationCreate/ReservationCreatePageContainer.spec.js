import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';
import Loader from 'react-loader';

import { ReservationCreateForm } from 'shared/reservation-form';
import { getState } from 'utils/testUtils';
import { mergeProps, UnconnectedReservationCreatePageContainer, selector } from './ReservationCreatePageContainer';

describe('pages/reservationCreate/ReservationCreatePageContainer', () => {
  const resources = {
    123: { id: '123' },
    234: { id: '234' },
  };
  const defaults = {
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
    function getSelected() {
      const state = getState({
        'data.resources': resources,
      });
      return selector(state);
    }

    it('returns resources', () => {
      expect(getSelected().resources).to.deep.equal(resources);
    });
  });

  describe('render', () => {
    describe('Loader', () => {
      it('is rendered', () => {
        const loader = getWrapper().find(Loader);
        expect(loader).to.have.length(1);
      });

      it('is loaded when resource exists', () => {
        const loaded = getWrapper().find(Loader);
        expect(loaded.prop('loaded')).to.be.true;
        const notLoaded = getWrapper({ resource: null }).find(Loader);
        expect(notLoaded.prop('loaded')).to.be.false;
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
        expect(form.prop('resource')).to.deep.equal(defaults.resource);
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

  describe('mergeProps', () => {
    it('returns resource based on query param', () => {
      const merged = mergeProps(
        { resources },
        {},
        { location: { query: { resource: '123' } } },
      );
      expect(merged.resource).to.deep.equal(resources['123']);
    });
  });
});
