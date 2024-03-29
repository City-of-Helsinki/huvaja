import { expect } from 'chai';

import types from '../actionTypes';
import {
  favoriteResource,
  fetchResource,
  fetchResources,
  unfavoriteResource,
  getParamsWithTimes,
} from './resources';
import { createApiTest } from './testUtils';
import { buildAPIUrl } from './utils';

describe('api/actions/resources', () => {
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

  describe('fetchResource', () => {
    const params = getParamsWithTimes();
    const resourceId = 'r-1';
    createApiTest({
      name: 'fetchResource',
      action: fetchResource,
      args: [resourceId],
      tests: {
        method: 'GET',
        endpoint: buildAPIUrl(`resource/${resourceId}`, params),
        request: {
          type: types.RESOURCE_GET_REQUEST,
        },
        success: {
          type: types.RESOURCE_GET_SUCCESS,
        },
        error: {
          type: types.RESOURCE_GET_ERROR,
        },
      },
    });
  });

  describe('fetchResources', () => {
    describe('with times', () => {
      const params = getParamsWithTimes({ resource_group: 'kanslia', pageSize: 100 });
      const metaArg = { resourceSelector: true };
      createApiTest({
        name: 'fetchResources',
        action: fetchResources,
        args: [{}, true, metaArg],
        tests: {
          method: 'GET',
          endpoint: buildAPIUrl('resource', params),
          request: {
            type: types.RESOURCES_GET_REQUEST,
          },
          success: {
            type: types.RESOURCES_GET_SUCCESS,
            extra: {
              tests: {
                'contains correct meta': ({ meta }) => {
                  expect(meta).to.deep.equal(metaArg);
                },
              },
            },
          },
          error: {
            type: types.RESOURCES_GET_ERROR,
          },
        },
      });
    });

    describe('without times', () => {
      const params = {
        resource_group: 'kanslia',
        pageSize: 1000,
        some: 'arg',
      };
      createApiTest({
        name: 'fetchResources',
        action: fetchResources,
        args: [{ some: 'arg' }, false],
        tests: {
          method: 'GET',
          endpoint: buildAPIUrl('resource', params),
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
