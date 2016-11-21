import pickBy from 'lodash/pickBy';
import { decamelizeKeys } from 'humps';

import createApiAction from './createApiAction';
import schemas from './schemas';

function editReservation(reservation) {
  return createApiAction({
    endpoint: `reservation/${reservation.id}`,
    method: 'PUT',
    type: 'RESERVATION',
    body: parseReservationData(reservation),
  });
}

function fetchReservations(params = {}) {
  return createApiAction({
    endpoint: 'reservation',
    params: Object.assign({}, params, { pageSize: 100 }),
    method: 'GET',
    type: 'RESERVATIONS',
    options: { schema: schemas.paginatedReservationsSchema },
  });
}

function makeReservation(reservation) {
  return createApiAction({
    endpoint: 'reservation',
    method: 'POST',
    type: 'RESERVATION',
    body: parseReservationData(reservation),
  });
}

function parseReservationData(reservation) {
  const parsed = pickBy(reservation, value => value || value === 0);
  return JSON.stringify(decamelizeKeys(parsed));
}

export {
  editReservation,
  fetchReservations,
  makeReservation,
};
