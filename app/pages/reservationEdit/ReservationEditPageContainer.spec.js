import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Loader from 'react-loader';
import simple from 'simple-mock';

import { ReservationEditForm } from 'shared/reservation-form';
import { UnconnectedReservationEditPageContainer } from './ReservationEditPageContainer';

describe('pages/reservationEdit/ReservationEditPageContainer', () => {
  const defaults = {
    cateringOrder: { id: 3 },
    fetchCateringOrder: () => null,
    fetchReservation: () => null,
    isFetching: false,
    params: {
      id: '234',
    },
    reservation: {
      hasCateringOrder: true,
      id: 234,
      userPermissions: {
        canModify: true,
      },
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

    describe('componentWillReceiveProps', () => {
      it('fetches cateringOrder when reservation with catering order appears', () => {
        const fetchCateringOrder = simple.mock();
        const props = {
          ...defaults,
          fetchCateringOrder,
          reservation: {
            ...defaults.reservation,
            hasCateringOrder: false,
          },
        };
        const instance = getWrapper(props).instance();
        instance.componentWillReceiveProps(defaults);
        expect(fetchCateringOrder.callCount).to.equal(1);
        expect(fetchCateringOrder.lastCall.arg).to.equal(
          defaults.reservation.id
        );
      });

      it('does not fetch cateringOrder when reservation with order already existed', () => {
        const fetchCateringOrder = simple.mock();
        const instance = getWrapper({ fetchCateringOrder }).instance();
        instance.componentWillReceiveProps(defaults);
        expect(fetchCateringOrder.callCount).to.equal(0);
      });
    });
  });

  describe('render', () => {
    describe('Loader', () => {
      it('is rendered', () => {
        const loader = getWrapper().find(Loader);
        expect(loader).to.have.length(1);
      });

      it('is loaded when isFetching is false', () => {
        const loader = getWrapper({ isFetching: false }).find(Loader);
        expect(loader.prop('loaded')).to.be.true;
      });

      it('is not loaded when isFetching is true', () => {
        const loader = getWrapper({ isFetching: true }).find(Loader);
        expect(loader.prop('loaded')).to.be.false;
      });
    });

    describe('ReservationEditForm', () => {
      it('is rendered with correct props', () => {
        const form = getWrapper().find(ReservationEditForm);
        expect(form).to.have.length(1);
        expect(form.prop('initialResource')).to.deep.equal(defaults.resource);
        expect(form.prop('reservation')).to.deep.equal(defaults.reservation);
        expect(form.prop('cateringOrder')).to.deep.equal(defaults.cateringOrder);
      });
    });

    describe('when reservation is not found', () => {
      const props = { reservation: null };

      it('renders message', () => {
        const wrapper = getWrapper(props);
        const message = wrapper.find('.message');
        expect(message.text()).to.equal('Varausta ei löytynyt.');
      });

      it('does not render form', () => {
        const wrapper = getWrapper(props);
        const form = wrapper.find(ReservationEditForm);
        expect(form).to.have.length(0);
      });
    });

    describe('when user cannot modify', () => {
      const props = {
        reservation: {
          ...defaults.reservation,
          userPermissions: { canModify: false },
        },
      };

      it('renders message', () => {
        const wrapper = getWrapper(props);
        const message = wrapper.find('.message');
        expect(message.text()).to.equal(
          'Sinulla ei ole oikeutta muokata tätä varausta.'
        );
      });

      it('does not render form', () => {
        const wrapper = getWrapper(props);
        const form = wrapper.find(ReservationEditForm);
        expect(form).to.have.length(0);
      });
    });
  });
});
