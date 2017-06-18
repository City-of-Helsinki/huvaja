import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import { fetchReservationDetailsReport } from 'api/actions';

ReservationDetailsReportButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  reservationId: PropTypes.number.isRequired,
};
export function ReservationDetailsReportButton({ onClick, reservationId }) {
  return (
    <div className="reservation-details-report-button">
      <DropdownButton
        id="reservation-details-report-button"
        title="Lataa raportti"
      >
        <MenuItem onClick={() => onClick(reservationId)} >
          Täysi raportti
        </MenuItem>
      </DropdownButton>
    </div>
  );
}

const actions = { onClick: fetchReservationDetailsReport };

export default connect(null, actions)(ReservationDetailsReportButton);
