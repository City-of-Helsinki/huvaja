import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Loader from 'react-loader';
import simple from 'simple-mock';

import { ReservationEditForm } from 'shared/reservation-form';
import { UnconnectedReservationEditPageContainer } from './ReservationEditPageContainer';

describe('pages/reservationEdit/ReservationEditPageContainer', () => {
  const defaults = {
    fetchReservation: () => null,
    params: {
      id: '234',
    },
    reservation: {
      id: 234,
    },
    resource: {
      id: '123',
    },
  };
  function getWrapper(props) {
    return shallow(<UnconnectedReservationEditPageContainer {...defaults} {...props} />);
  }

  describe('lifecycle methods', () => {
    describe('componentDidMount', () => {
      it('fetches reservation with correct id', () => {
        const fetchReservation = simple.mock();
        const instance = getWrapper({ fetchReservation }).instance();
        instance.componentDidMount();
        expect(fetchReservation.callCount).to.equal(1);
        expect(fetchReservation.lastCall.arg).to.equal(defaults.params.id);
      });
    });
  });

  describe('render', () => {
    describe('Loader', () => {
      it('is rendered', () => {
        const loader = getWrapper().find(Loader);
        expect(loader).to.have.length(1);
      });

      it('is loaded when reservation and resource exists', () => {
        const loader = getWrapper().find(Loader);
        expect(loader.prop('loaded')).to.be.true;
      });

      it('is not loaded when resource does not exist', () => {
        const loader = getWrapper({ resource: null }).find(Loader);
        expect(loader.prop('loaded')).to.be.false;
      });

      it('is not loaded when reservation does not exist', () => {
        const loader = getWrapper({ reservation: null }).find(Loader);
        expect(loader.prop('loaded')).to.be.false;
      });
    });

    describe('ReservationEditForm', () => {
      it('is rendered with correct props', () => {
        const form = getWrapper().find(ReservationEditForm);
        expect(form).to.have.length(1);
        expect(form.prop('resource')).to.deep.equal(defaults.resource);
        expect(form.prop('reservation')).to.deep.equal(defaults.reservation);
      });
    });
  });
});
