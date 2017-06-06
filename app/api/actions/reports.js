import moment from 'moment';

import { createReportAction } from './utils';

function fetchResourceDailyReport({ date, resourceIds }) {
  return createReportAction({
    endpoint: 'daily_reservations',
    type: 'RESOURCE_DAILY_REPORT',
    params: {
      resource: resourceIds.join(','),
      day: moment(date).format('YYYY-MM-DD'),
    },
  });
}

export {
  fetchResourceDailyReport,  // eslint-disable-line import/prefer-default-export
};
