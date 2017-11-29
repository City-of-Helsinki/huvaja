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

function fetchReservationDetailsReport(reservationId) {
  return createReportAction({
    endpoint: 'reservation_details',
    filename: `varaus-${reservationId}`,
    type: 'RESERVATION_DETAILS_REPORT',
    params: {
      reservation: reservationId,
    },
  });
}

function fetchReservationsReport(filters) {
  return createReportAction({
    endpoint: 'reservation_details',
    filename: 'varaukset',
    type: 'RESERVATIONS_REPORT',
    params: filters,
  });
}

export {
  fetchReservationDetailsReport,
  fetchResourceDailyReport,
  fetchReservationsReport,
};
