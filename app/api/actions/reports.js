import moment from 'moment';

import { createReportAction } from './utils';

function fetchResourceDailyReport({ date, resourceIds }) {
  const day = moment(date).format('YYYY-MM-DD');
  return createReportAction({
    endpoint: 'daily_reservations',
    filename: `paivaraportti-${day}.docx`,
    type: 'RESOURCE_DAILY_REPORT',
    params: {
      resource: resourceIds.join(','),
      includeResourcesWithoutReservations: 'true',
      day,
    },
  });
}

function fetchReservationDetailsReport(reservationId) {
  return createReportAction({
    endpoint: 'reservation_details',
    filename: `varaus-${reservationId}.docx`,
    type: 'RESERVATION_DETAILS_REPORT',
    params: {
      reservation: reservationId,
    },
  });
}

function fetchReservationsReport(filters) {
  return createReportAction({
    endpoint: 'reservation_details',
    filename: 'varaukset.docx',
    type: 'RESERVATIONS_REPORT',
    params: filters,
  });
}

function fetchReservationsRateReport(filters) {
  return createReportAction({
    endpoint: 'reservation_rate',
    filename: 'varausasteraportti.xlsx',
    type: 'RESERVATIONS_RATE_REPORT',
    params: filters,
  });
}

export {
  fetchReservationDetailsReport,
  fetchResourceDailyReport,
  fetchReservationsReport,
  fetchReservationsRateReport,
};
