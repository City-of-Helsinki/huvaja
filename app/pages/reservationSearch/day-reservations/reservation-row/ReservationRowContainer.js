import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import uiActions from 'actions/uiActions';
import selector from './reservationRowSelector';
import ReservationRow from './ReservationRow';

UnconnectedReservationRowContainer.propTypes = {
  eventSubject: PropTypes.string.isRequired,
  hostName: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  numberOfParticipants: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  place: PropTypes.string.isRequired,
  timeRange: PropTypes.string.isRequired,
};
export function UnconnectedReservationRowContainer(props) {
  return (
    <ReservationRow
      eventSubject={props.eventSubject}
      hostName={props.hostName}
      numberOfParticipants={props.numberOfParticipants}
      onClick={() => props.onClick(props.id)}
      place={props.place}
      timeRange={props.timeRange}
    />
  );
}

const actions = {
  onClick: uiActions.showReservationInfoModal,
};

export default connect(selector, actions)(UnconnectedReservationRowContainer);
