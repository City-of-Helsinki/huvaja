import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import { fetchReservationsReport } from 'api/actions';
import uiActions from 'actions/uiActions';

ReservationsReportButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  searchFilters: PropTypes.object.isRequired,
  showReservationsRateReportModal: PropTypes.func.isRequired,
};

export function ReservationsReportButton({
  onClick, showReservationsRateReportModal, searchFilters,
}) {
  return (
    <div className="reservations-report-button">
      <DropdownButton
        bsStyle="primary"
        id="reservations-report-button"
        title="Lataa raportti"
      >
        <MenuItem onClick={() => onClick(searchFilters)} >
          Varausraportti
        </MenuItem>
        <MenuItem onClick={showReservationsRateReportModal} >
          Varausasteraportti
        </MenuItem>
      </DropdownButton>
    </div>
  );
}

const actions = {
  onClick: fetchReservationsReport,
  showReservationsRateReportModal: uiActions.showReservationsRateReportModal,
};

export default connect(null, actions)(ReservationsReportButton);
