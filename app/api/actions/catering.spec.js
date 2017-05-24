import types from '../actionTypes';
import { fetchCateringProviders } from './catering';
import { buildAPIUrl } from './createApiAction';
import { createApiTest } from './testUtils';

describe('api/actions/equipment', () => {
  describe('fetchCateringProviders', () => {
    createApiTest({
      name: 'fetchCateringProviders',
      action: fetchCateringProviders,
      args: [],
      tests: {
        method: 'GET',
        endpoint: buildAPIUrl('catering_provider', { resource_group: 'kanslia' }),
        request: {
          type: types.CATERING_PROVIDERS_GET_REQUEST,
        },
        success: {
          type: types.CATERING_PROVIDERS_GET_SUCCESS,
        },
        error: {
          type: types.CATERING_PROVIDERS_GET_ERROR,
        },
      },
    });
  });
});
