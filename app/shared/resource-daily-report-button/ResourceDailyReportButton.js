import moment from 'moment';
import queryString from 'query-string';
import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';

ResourceDailyReportButton.propTypes = {
  date: PropTypes.string.isRequired,
  resourceIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function ResourceDailyReportButton({ date, resourceIds }) {
  const endpoint = `${SETTINGS.API_URL.replace('v1/', '')}reports/daily_reservations/`;
  const params = queryString.stringify({
    resource: resourceIds.join(','),
    day: moment(date).format('YYYY-MM-DD'),
  });
  const reportLink = `${endpoint}?${params}`;
  return (
    <Button bsStyle="primary" className="resource-daily-report-button" href={reportLink}>
      Lataa päiväraportti
    </Button>
  );
}

export default ResourceDailyReportButton;
