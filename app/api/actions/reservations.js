import pickBy from 'lodash/pickBy';
import { decamelizeKeys } from 'humps';

import createApiAction from './createApiAction';
import schemas from './schemas';

function cancelReservation(reservation) {
  return createApiAction({
    endpoint: `reservation/${reservation.id}`,
    method: 'DELETE',
    type: 'RESERVATION',
    options: {
      payload: () => reservation,
    },
  });
}

function editReservation(reservation, options) {
  return createApiAction({
    endpoint: `reservation/${reservation.id}`,
    method: 'PUT',
    type: 'RESERVATION',
    body: parseReservationData(reservation),
    options,
  });
}

function fetchReservation(id) {
  return createApiAction({
    endpoint: `reservation/${id}`,
    params: { all: true },
    method: 'GET',
    type: 'RESERVATION',
    options: { schema: schemas.reservationSchema },
  });
}

function fetchReservations(params = {}) {
  const defaultParams = {
    resource_group: 'kanslia',
    pageSize: 100,
  };
  return createApiAction({
    endpoint: 'reservation',
    params: { ...defaultParams, ...params },
    method: 'GET',
    type: 'RESERVATIONS',
    options: { schema: schemas.paginatedReservationsSchema },
  });
}

function makeReservation(reservation, options) {
  return createApiAction({
    endpoint: 'reservation',
    method: 'POST',
    type: 'RESERVATION',
    body: parseReservationData(reservation),
    options,
  });
}

function parseReservationData(reservation) {
  const parsed = pickBy(reservation, value => value || value === 0);
  return JSON.stringify(decamelizeKeys(parsed));
}

export {
  cancelReservation,
  editReservation,
  fetchReservation,
  fetchReservations,
  makeReservation,
};
