import types from '../actionTypes';
import { buildAPIUrl } from './createApiAction';
import {
  cancelReservation,
  editReservation,
  fetchReservation,
  fetchReservations,
  makeReservation,
} from './reservations';
import { createApiTest } from './testUtils';

describe('api/actions/reservations', () => {
  describe('cancelReservation', () => {
    const reservation = { foo: 'bar' };

    createApiTest({
      name: 'cancelReservation',
      action: cancelReservation,
      args: [reservation],
      tests: {
        method: 'DELETE',
        endpoint: buildAPIUrl(`reservation/${reservation.id}`),
        request: {
          type: types.RESERVATION_DELETE_REQUEST,
        },
        success: {
          type: types.RESERVATION_DELETE_SUCCESS,
          payload: reservation,
        },
        error: {
          type: types.RESERVATION_DELETE_ERROR,
        },
      },
    });
  });

  describe('editReservation', () => {
    const reservation = { foo: 'bar' };

    createApiTest({
      name: 'editReservation',
      action: editReservation,
      args: [reservation],
      tests: {
        method: 'PUT',
        endpoint: buildAPIUrl(`reservation/${reservation.id}`),
        body: reservation,
        request: {
          type: types.RESERVATION_PUT_REQUEST,
        },
        success: {
          type: types.RESERVATION_PUT_SUCCESS,
        },
        error: {
          type: types.RESERVATION_PUT_ERROR,
        },
      },
    });
  });

  describe('fetchReservations', () => {
    const reservationId = 123;
    createApiTest({
      name: 'fetchReservation',
      action: fetchReservation,
      args: [reservationId],
      tests: {
        method: 'GET',
        endpoint: buildAPIUrl(`reservation/${reservationId}`, { all: true }),
        request: {
          type: types.RESERVATION_GET_REQUEST,
        },
        success: {
          type: types.RESERVATION_GET_SUCCESS,
        },
        error: {
          type: types.RESERVATION_GET_ERROR,
        },
      },
    });
  });

  describe('fetchReservations', () => {
    createApiTest({
      name: 'fetchReservations',
      action: fetchReservations,
      args: [],
      tests: {
        method: 'GET',
        endpoint: buildAPIUrl('reservation', { pageSize: 100 }),
        request: {
          type: types.RESERVATIONS_GET_REQUEST,
        },
        success: {
          type: types.RESERVATIONS_GET_SUCCESS,
        },
        error: {
          type: types.RESERVATIONS_GET_ERROR,
        },
      },
    });
  });

  describe('makeReservation', () => {
    const reservation = { foo: 'bar' };

    createApiTest({
      name: 'makeReservation',
      action: makeReservation,
      args: [reservation],
      tests: {
        method: 'POST',
        endpoint: buildAPIUrl('reservation'),
        body: reservation,
        request: {
          type: types.RESERVATION_POST_REQUEST,
        },
        success: {
          type: types.RESERVATION_POST_SUCCESS,
        },
        error: {
          type: types.RESERVATION_POST_ERROR,
        },
      },
    });
  });
});
