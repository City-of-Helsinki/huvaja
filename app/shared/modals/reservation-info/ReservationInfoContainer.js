import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import uiActions from 'actions/uiActions';
import {
  fetchCateringOrder,
  fetchCateringProductCategories,
  fetchCateringProducts,
  fetchReservation,
} from 'api/actions';
import reservationModalSelector from './reservationInfoSelector';
import ReservationInfo from './ReservationInfo';

export class UnconnectedReservationInfoContainer extends React.Component {
  static propTypes = {
    cateringOrder: PropTypes.object,
    cateringOrderItems: PropTypes.array.isRequired,
    cateringProvider: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    fetchCateringOrder: PropTypes.func.isRequired,
    fetchCateringProductCategories: PropTypes.func.isRequired,
    fetchCateringProducts: PropTypes.func.isRequired,
    fetchReservation: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    reservation: PropTypes.object,
    reservationId: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
    resource: PropTypes.object,
    shouldFetchCateringData: (
      PropTypes.bool.isRequired // eslint-disable-line react/no-unused-prop-types
    ),
    show: PropTypes.bool.isRequired,
    showReservationCancelModal: PropTypes.func.isRequired,
    unit: PropTypes.object,
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.reservation && nextProps.reservationId) {
      this.props.fetchReservation(nextProps.reservationId);
    }

    if (this.shouldFetchCateringOrder(nextProps)) {
      this.props.fetchCateringOrder(nextProps.reservation.id);
    }

    if (nextProps.shouldFetchCateringData && nextProps.cateringProvider) {
      const id = nextProps.cateringProvider.id;
      this.props.fetchCateringProducts(id);
      this.props.fetchCateringProductCategories(id);
    }
  }

  shouldFetchCateringOrder(nextProps) {
    const prevId = this.props.reservation && this.props.reservation.id;
    const nextId = nextProps.reservation && nextProps.reservation.id;
    return (
      nextId &&
      nextId !== prevId &&
      nextProps.reservation.hasCateringOrder
    );
  }

  render() {
    return (this.props.reservation ?
      <ReservationInfo
        cateringOrder={this.props.cateringOrder}
        cateringOrderItems={this.props.cateringOrderItems}
        onHide={this.props.onHide}
        reservation={this.props.reservation}
        resource={this.props.resource}
        show={this.props.show}
        showReservationCancelModal={this.props.showReservationCancelModal}
        unit={this.props.unit}
      /> :
      <div />
    );
  }
}


const actions = {
  fetchCateringOrder,
  fetchCateringProductCategories,
  fetchCateringProducts,
  fetchReservation,
  onHide: uiActions.hideReservationInfoModal,
  showReservationCancelModal: uiActions.showReservationCancelModal,
};

export default connect(reservationModalSelector, actions)(
  UnconnectedReservationInfoContainer
);
