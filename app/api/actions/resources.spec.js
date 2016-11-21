import { expect } from 'chai';

import types from '../actionTypes';
import {
  favoriteResource,
  unfavoriteResource,
  fetchResources,
} from './resources';
import { createApiTest } from './testUtils';
import { buildAPIUrl } from './createApiAction';

describe('api/resources', () => {
  describe('favoriteResource', () => {
    const resourceId = '123';

    createApiTest({
      name: 'favorite',
      action: favoriteResource,
      args: [resourceId],
      tests: {
        method: 'POST',
        endpoint: buildAPIUrl(`resource/${resourceId}/favorite`),
        request: {
          type: types.RESOURCE_FAVORITE_POST_REQUEST,
        },
        success: {
          type: types.RESOURCE_FAVORITE_POST_SUCCESS,
          extra: {
            tests: {
              'contains resource id in meta': ({ meta }) => {
                expect(meta.id).to.equal(resourceId);
              },
            },
          },
        },
        error: {
          type: types.RESOURCE_FAVORITE_POST_ERROR,
        },
      },
    });
  });

  describe('api/units', () => {
    describe('fetchResources', () => {
      createApiTest({
        name: 'fetchResources',
        action: fetchResources,
        args: [],
        tests: {
          method: 'GET',
          endpoint: buildAPIUrl('resource', { pageSize: 100 }),
          request: {
            type: types.RESOURCES_GET_REQUEST,
          },
          success: {
            type: types.RESOURCES_GET_SUCCESS,
          },
          error: {
            type: types.RESOURCES_GET_ERROR,
          },
        },
      });
    });
  });


  describe('unfavoriteResource', () => {
    const resourceId = '123';

    createApiTest({
      name: 'unfavorite',
      action: unfavoriteResource,
      args: [resourceId],
      tests: {
        method: 'POST',
        endpoint: buildAPIUrl(`resource/${resourceId}/unfavorite`),
        request: {
          type: types.RESOURCE_UNFAVORITE_POST_REQUEST,
        },
        success: {
          type: types.RESOURCE_UNFAVORITE_POST_SUCCESS,
          extra: {
            tests: {
              'contains resource id in meta': ({ meta }) => {
                expect(meta.id).to.equal(resourceId);
              },
            },
          },
        },
        error: {
          type: types.RESOURCE_UNFAVORITE_POST_ERROR,
        },
      },
    });
  });
});
