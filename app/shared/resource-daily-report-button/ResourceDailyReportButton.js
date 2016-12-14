import moment from 'moment';
import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';

import { buildAPIUrl } from 'api/actions/createApiAction';

ResourceDailyReportButton.propTypes = {
  date: PropTypes.string.isRequired,
  resourceIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function ResourceDailyReportButton({ date, resourceIds }) {
  function getReportLink() {
    return buildAPIUrl('reports/day_events', {
      resource: resourceIds.join(','),
      day: moment(date).format('YYYY-MM-DD'),
    });
  }
  return (
    <Button bsStyle="primary" className="resource-daily-report-button" href={getReportLink()}>
      Lataa päiväraportti
    </Button>
  );
}

export default ResourceDailyReportButton;
