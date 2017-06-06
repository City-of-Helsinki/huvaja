import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/lib/Button';

import { fetchResourceDailyReport } from 'api/actions';

ResourceDailyReportButton.propTypes = {
  date: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  resourceIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function ResourceDailyReportButton({ date, onClick, resourceIds }) {
  return (
    <Button
      bsStyle="primary"
      className="resource-daily-report-button"
      onClick={() => onClick({ date, resourceIds })}
    >
      Lataa päiväraportti
    </Button>
  );
}

const actions = { onClick: fetchResourceDailyReport };

export default connect(null, actions)(ResourceDailyReportButton);
