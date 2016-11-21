import types from '../actionTypes';
import {
  fetchReservations,
} from './reservations';
import { createApiTest } from './testUtils';
import { buildAPIUrl } from './createApiAction';

describe('api/actions/reservations', () => {
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
});
