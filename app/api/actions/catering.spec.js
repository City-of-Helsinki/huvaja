import types from '../actionTypes';
import {
  fetchCateringProducts,
  fetchCateringProductCategories,
  fetchCateringProviders,
} from './catering';
import { buildAPIUrl } from './createApiAction';
import { createApiTest } from './testUtils';

describe('api/actions/equipment', () => {
  const pageSize = 1000;

  describe('fetchCateringProducts', () => {
    const provider = 32;
    createApiTest({
      name: 'fetchCateringProducts',
      action: fetchCateringProducts,
      args: [provider],
      tests: {
        method: 'GET',
        endpoint: buildAPIUrl('catering_product', {
          resource_group: 'kanslia',
          provider,
          pageSize,
        }),
        request: {
          type: types.CATERING_PRODUCTS_GET_REQUEST,
        },
        success: {
          type: types.CATERING_PRODUCTS_GET_SUCCESS,
        },
        error: {
          type: types.CATERING_PRODUCTS_GET_ERROR,
        },
      },
    });
  });

  describe('fetchCateringProductCategories', () => {
    const provider = 32;
    createApiTest({
      name: 'fetchCateringProductCategories',
      action: fetchCateringProductCategories,
      args: [provider],
      tests: {
        method: 'GET',
        endpoint: buildAPIUrl('catering_product_category', {
          resource_group: 'kanslia',
          provider,
          pageSize,
        }),
        request: {
          type: types.CATERING_PRODUCT_CATEGORIES_GET_REQUEST,
        },
        success: {
          type: types.CATERING_PRODUCT_CATEGORIES_GET_SUCCESS,
        },
        error: {
          type: types.CATERING_PRODUCT_CATEGORIES_GET_ERROR,
        },
      },
    });
  });

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
