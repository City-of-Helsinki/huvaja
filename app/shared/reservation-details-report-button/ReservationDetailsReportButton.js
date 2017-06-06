import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/lib/Button';

import { fetchReservationDetailsReport } from 'api/actions';

ReservationDetailsReportButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  reservationId: PropTypes.number.isRequired,
};
export function ReservationDetailsReportButton({ onClick, reservationId }) {
  return (
    <Button
      className="reservation-details-report-button"
      onClick={() => onClick(reservationId)}
    >
      Lataa raportti
    </Button>
  );
}

const actions = { onClick: fetchReservationDetailsReport };

export default connect(null, actions)(ReservationDetailsReportButton);
