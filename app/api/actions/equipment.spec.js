import types from '../actionTypes';
import { createApiTest } from './testUtils';
import { fetchEquipment } from './equipment';
import { buildAPIUrl } from './createApiAction';

describe('api/actions/equipment', () => {
  describe('fetchEquipment', () => {
    createApiTest({
      name: 'fetchEquipment',
      action: fetchEquipment,
      args: [],
      tests: {
        method: 'GET',
        endpoint: buildAPIUrl('equipment', { pageSize: 100 }),
        request: {
          type: types.EQUIPMENT_GET_REQUEST,
        },
        success: {
          type: types.EQUIPMENT_GET_SUCCESS,
        },
        error: {
          type: types.EQUIPMENT_GET_ERROR,
        },
      },
    });
  });
});
