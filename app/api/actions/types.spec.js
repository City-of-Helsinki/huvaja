import types from '../actionTypes';
import { createApiTest } from './testUtils';
import { fetchTypes } from './types';
import { buildAPIUrl } from './createApiAction';

describe('api/actions/types', () => {
  describe('fetchTypes', () => {
    createApiTest({
      name: 'fetchTypes',
      action: fetchTypes,
      args: [],
      tests: {
        method: 'GET',
        endpoint: buildAPIUrl('type', { pageSize: 100, resource_group: 'kanslia' }),
        request: {
          type: types.TYPES_GET_REQUEST,
        },
        success: {
          type: types.TYPES_GET_SUCCESS,
        },
        error: {
          type: types.TYPES_GET_ERROR,
        },
      },
    });
  });
});
