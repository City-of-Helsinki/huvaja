import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import { fetchResourceDailyReport } from 'api/actions';

ResourceDailyReportButton.propTypes = {
  date: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  resourceIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export function ResourceDailyReportButton({ date, onClick, resourceIds }) {
  return (
    <div className="resource-daily-report-button">
      <DropdownButton
        bsStyle="primary"
        id="resource-daily-report-button"
        title="Lataa raportti"
      >
        <MenuItem onClick={() => onClick({ date, resourceIds })} >
          Päiväraportti
        </MenuItem>
      </DropdownButton>
    </div>
  );
}

const actions = { onClick: fetchResourceDailyReport };

export default connect(null, actions)(ResourceDailyReportButton);
