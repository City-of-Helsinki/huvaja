import moment from 'moment';

import { createReportAction } from './utils';

function fetchResourceDailyReport({ date, resourceIds }) {
  const day = moment(date).format('YYYY-MM-DD');
  return createReportAction({
    endpoint: 'daily_reservations',
    filename: `paivaraportti-${day}`,
    type: 'RESOURCE_DAILY_REPORT',
    params: {
      resource: resourceIds.join(','),
      day,
    },
  });
}

export {
  fetchResourceDailyReport,  // eslint-disable-line import/prefer-default-export
};
