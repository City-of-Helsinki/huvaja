import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import uiActions from 'actions/uiActions';
import selector from './reservationSuccessModalSelector';
import ReservationSuccessModal from './ReservationSuccessModal';

UnconnectedReservationSuccessModalContainer.propTypes = {
  createdReservations: PropTypes.array.isRequired,
  editedReservation: PropTypes.object,
  failedReservations: PropTypes.array.isRequired,
  onHide: PropTypes.func.isRequired,
  resourceNames: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
};
export function UnconnectedReservationSuccessModalContainer(props) {
  return <ReservationSuccessModal {...props} />;
}

const actions = {
  onHide: uiActions.hideReservationSuccessModal,
};

export default connect(selector, actions)(
  UnconnectedReservationSuccessModalContainer
);
