import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import uiActions from 'actions/uiActions';
import { fetchReservation } from 'api/actions';
import reservationModalSelector from './reservationInfoSelector';
import ReservationInfo from './ReservationInfo';


export class UnconnectedReservationInfoContainer extends React.Component {
  static propTypes = {
    fetchReservation: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    reservation: PropTypes.object,
    reservationId: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
    resource: PropTypes.object,
    show: PropTypes.bool.isRequired,
    unit: PropTypes.object,
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.reservation && nextProps.reservationId) {
      this.props.fetchReservation(nextProps.reservationId);
    }
  }

  render() {
    return (this.props.reservation ?
      <ReservationInfo
        onHide={this.props.onHide}
        reservation={this.props.reservation}
        resource={this.props.resource}
        show={this.props.show}
        unit={this.props.unit}
      /> :
      <div />
    );
  }
}


const actions = {
  fetchReservation,
  onHide: uiActions.hideReservationInfoModal,
};

export default connect(reservationModalSelector, actions)(
  UnconnectedReservationInfoContainer
);
