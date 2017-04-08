import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import uiActions from 'actions/uiActions';
import { cancelReservation } from 'api/actions';
import ReservationCancel from './ReservationCancel';
import ReservationCancelModalSelector from './ReservationCancelSelector';

UnconnectedReservationCancelContainer.propTypes = {
  cancelReservation: PropTypes.func.isRequired,
  isCancelling: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  reservation: PropTypes.object,
  show: PropTypes.bool.isRequired,
};
export function UnconnectedReservationCancelContainer(props) {
  return (props.reservation ?
    <ReservationCancel
      cancelReservation={props.cancelReservation}
      isCancelling={props.isCancelling}
      onHide={props.onHide}
      reservation={props.reservation}
      show={props.show}
    /> :
    <div />
  );
}

const actions = {
  cancelReservation,
  onHide: uiActions.hideReservationCancelModal,
};

export default connect(ReservationCancelModalSelector, actions)(
  UnconnectedReservationCancelContainer
);
