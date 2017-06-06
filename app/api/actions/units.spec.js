import types from '../actionTypes';
import { createApiTest } from './testUtils';
import { fetchUnits } from './units';
import { buildAPIUrl } from './utils';

describe('api/actions/units', () => {
  describe('fetchUnits', () => {
    createApiTest({
      name: 'fetchUnits',
      action: fetchUnits,
      args: [],
      tests: {
        method: 'GET',
        endpoint: buildAPIUrl('unit', { pageSize: 100, resource_group: 'kanslia' }),
        request: {
          type: types.UNITS_GET_REQUEST,
        },
        success: {
          type: types.UNITS_GET_SUCCESS,
        },
        error: {
          type: types.UNITS_GET_ERROR,
        },
      },
    });
  });
});
