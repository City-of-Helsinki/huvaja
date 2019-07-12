import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import { fetchReservationsReport, fetchReservationListReport } from 'api/actions';

ReservationsReportButton.propTypes = {
  onListReportClick: PropTypes.func.isRequired,
  onDetailedReportClick: PropTypes.func.isRequired,
  searchFilters: PropTypes.object.isRequired,
};

export function ReservationsReportButton({
  onListReportClick, onDetailedReportClick, searchFilters,
}) {
  return (
    <div className="reservations-report-button">
      <DropdownButton
        bsStyle="primary"
        id="reservations-report-button"
        title="Lataa raportti"
      >
        <MenuItem onClick={() => onDetailedReportClick(searchFilters)} >
          Varausraportti
        </MenuItem>
        <MenuItem onClick={() => onListReportClick(searchFilters)} >
          Listaraportti
        </MenuItem>
      </DropdownButton>
    </div>
  );
}

const actions = {
  onListReportClick: fetchReservationListReport,
  onDetailedReportClick: fetchReservationsReport,
};

export default connect(null, actions)(ReservationsReportButton);
