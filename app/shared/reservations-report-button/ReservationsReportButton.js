import React, { PropTypes } from 'react';
import fileSaver from 'file-saver';
import { connect } from 'react-redux';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import { buildUrl } from 'api/actions/utils';

ReservationsReportButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export function ReservationsReportButton({ onClick }) {
  return (
    <div className="reservations-report-button">
      <DropdownButton
        bsStyle="primary"
        id="reservations-report-button"
        title="Lataa raportti"
      >
        <MenuItem onClick={() => onClick()} >
          Varausraportti
        </MenuItem>
      </DropdownButton>
    </div>
  );
}

// Return a function that has the auth token and filters closured
function reportFetcher(jwttoken, searchFilters) {
  return () =>
    fetch(
      new Request(
        buildUrl(SETTINGS.REPORT_URL, 'reservation_details', searchFilters)
      ),
      {
        method: 'GET',
        headers: { Authorization: `JWT ${jwttoken}` },
      }
    ).then(response => response.blob())
     .then(blob => fileSaver.saveAs(blob, 'varaukset.docx'))
     // TODO Should be changed to proper error handling like Raven
     // eslint-disable-next-line no-console
     .catch(console.log.bind(console));
}

export default connect(state => ({ jwttoken: state.auth.token }))(
  // eslint doesn't like React components that are just render functions
  // eslint-disable-next-line new-cap
  ({ searchFilters, jwttoken }) => ReservationsReportButton({
    onClick: reportFetcher(jwttoken, searchFilters),
  }));
