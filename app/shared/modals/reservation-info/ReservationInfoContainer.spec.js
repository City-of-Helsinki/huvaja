import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import ReservationInfo from './ReservationInfo';
import { UnconnectedReservationInfoContainer as ReservationInfoContainer } from './ReservationInfoContainer';

describe('shared/modals/reservation-info/ReservationInfoContainer', () => {
  const defaults = {
    cateringOrder: { id: 123 },
    cateringOrderItems: [{ quantity: 10, name: 'Coffee' }],
    cateringProvider: { id: 89 },
    fetchCateringOrder: () => null,
    fetchCateringProductCategories: () => null,
    fetchCateringProducts: () => null,
    fetchReservation: () => null,
    onHide: () => null,
    reservation: { id: 1, hasCateringOrder: true },
    reservationId: 1,
    resource: {},
    shouldFetchCateringData: false,
    show: true,
    showReservationCancelModal: () => null,
    unit: {},
  };
  function getWrapper(props) {
    return shallow(<ReservationInfoContainer {...defaults} {...props} />);
  }

  describe('render', () => {
    it('renders a ReservationInfo', () => {
      const reservationInfo = getWrapper().find(ReservationInfo);
      expect(reservationInfo).to.have.length(1);
      expect(reservationInfo.prop('cateringOrder')).to.equal(defaults.cateringOrder);
      expect(reservationInfo.prop('cateringOrderItems')).to.equal(defaults.cateringOrderItems);
      expect(reservationInfo.prop('onHide')).to.equal(defaults.onHide);
      expect(reservationInfo.prop('reservation')).to.equal(defaults.reservation);
      expect(reservationInfo.prop('resource')).to.equal(defaults.resource);
      expect(reservationInfo.prop('show')).to.equal(defaults.show);
      expect(reservationInfo.prop('showReservationCancelModal')).to.equal(
        defaults.showReservationCancelModal
      );
      expect(reservationInfo.prop('unit')).to.equal(defaults.unit);
    });
  });

  describe('componentWillReceiveProps', () => {
    it('fetches reservation if nextProps with reservationId and without reservation', () => {
      const fetchReservation = simple.mock();
      const instance = getWrapper({ fetchReservation }).instance();
      instance.componentWillReceiveProps({
        reservation: null,
        reservationId: 12,
      });
      expect(fetchReservation.callCount).to.equal(1);
      expect(fetchReservation.lastCall.args).to.deep.equal([12]);
    });

    it('does not fetch reservation if nextProps with reservation', () => {
      const fetchReservation = simple.mock();
      const instance = getWrapper({ fetchReservation }).instance();
      instance.componentWillReceiveProps({
        reservation: {},
        reservationId: 12,
      });
      expect(fetchReservation.callCount).to.equal(0);
    });

    describe('fetching category order', () => {
      const noReservation = {
        reservation: null,
        cateringOrder: null,
      };

      it('is done if reservation with catering order appears', () => {
        const fetchCateringOrder = simple.mock();
        const instance = getWrapper({ fetchCateringOrder, ...noReservation }).instance();
        instance.componentWillReceiveProps({
          ...defaults,
          reservation: { id: 456, hasCateringOrder: true },
        });
        expect(fetchCateringOrder.callCount).to.equal(1);
        expect(fetchCateringOrder.lastCall.arg).to.equal(456);
      });

      it('is done if reservation without catering order appears', () => {
        const fetchCateringOrder = simple.mock();
        const instance = getWrapper({ fetchCateringOrder, ...noReservation }).instance();
        instance.componentWillReceiveProps({
          ...defaults,
          reservation: { id: 456, hasCateringOrder: false },
        });
        expect(fetchCateringOrder.callCount).to.equal(0);
      });

      it('is not done if reservation with catering order already existed', () => {
        const fetchCateringOrder = simple.mock();
        const props = { ...defaults, fetchCateringOrder };
        const instance = getWrapper(props).instance();
        instance.componentWillReceiveProps(props);
        expect(fetchCateringOrder.callCount).to.equal(0);
      });
    });

    describe('fetching catering products and categories', () => {
      it('is done if shouldFetchCateringData is true', () => {
        const fetchCateringProducts = simple.mock();
        const fetchCateringProductCategories = simple.mock();
        const props = {
          fetchCateringProducts,
          fetchCateringProductCategories,
        };
        const instance = getWrapper(props).instance();
        instance.componentWillReceiveProps({
          ...defaults,
          shouldFetchCateringData: true,
        });
        expect(fetchCateringProducts.callCount).to.equal(1);
        expect(fetchCateringProductCategories.callCount).to.equal(1);
        expect(fetchCateringProducts.lastCall.arg).to.equal(defaults.cateringProvider.id);
        expect(fetchCateringProductCategories.lastCall.arg).to.equal(defaults.cateringProvider.id);
      });

      it('is not done if shouldFetchCateringData is false', () => {
        const fetchCateringProducts = simple.mock();
        const fetchCateringProductCategories = simple.mock();
        const props = {
          fetchCateringProducts,
          fetchCateringProductCategories,
        };
        const instance = getWrapper(props).instance();
        instance.componentWillReceiveProps({
          ...defaults,
          shouldFetchCateringData: false,
        });
        expect(fetchCateringProducts.callCount).to.equal(0);
        expect(fetchCateringProductCategories.callCount).to.equal(0);
      });
    });
  });
});
