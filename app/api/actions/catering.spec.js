import types from '../actionTypes';
import {
  deleteCateringOrder,
  editCateringOrder,
  fetchCateringOrder,
  fetchCateringProducts,
  fetchCateringProductCategories,
  fetchCateringProviders,
  makeCateringOrder,
} from './catering';
import { createApiTest } from './testUtils';
import { buildAPIUrl } from './utils';

describe('api/actions/catering', () => {
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

  describe('makeCateringOrder', () => {
    const order = {
      message: 'Hello!',
      order: {
        2: 10,
      },
    };
    const body = {
      message: 'Hello!',
      order_lines: [{
        product: 2,
        quantity: 10,
      }],
    };
    createApiTest({
      name: 'makeCateringOrder',
      action: makeCateringOrder,
      args: [order],
      tests: {
        method: 'POST',
        endpoint: buildAPIUrl('catering_order'),
        body,
        request: {
          type: types.CATERING_ORDER_POST_REQUEST,
        },
        success: {
          type: types.CATERING_ORDER_POST_SUCCESS,
        },
        error: {
          type: types.CATERING_ORDER_POST_ERROR,
        },
      },
    });
  });

  describe('fetchCateringOrder', () => {
    const reservationId = 123;
    createApiTest({
      name: 'fetchCateringOrder',
      action: fetchCateringOrder,
      args: [reservationId],
      tests: {
        method: 'GET',
        endpoint: buildAPIUrl('catering_order', { reservation: reservationId }),
        request: {
          type: types.CATERING_ORDER_GET_REQUEST,
        },
        success: {
          type: types.CATERING_ORDER_GET_SUCCESS,
        },
        error: {
          type: types.CATERING_ORDER_GET_ERROR,
        },
      },
    });
  });

  describe('editCateringOrder', () => {
    const order = {
      id: 23,
      message: 'Hello!',
      order: {
        2: 10,
      },
    };
    const body = {
      id: 23,
      message: 'Hello!',
      order_lines: [{
        product: 2,
        quantity: 10,
      }],
    };
    createApiTest({
      name: 'editCateringOrder',
      action: editCateringOrder,
      args: [order],
      tests: {
        method: 'PUT',
        endpoint: buildAPIUrl(`catering_order/${order.id}`),
        body,
        request: {
          type: types.CATERING_ORDER_PUT_REQUEST,
        },
        success: {
          type: types.CATERING_ORDER_PUT_SUCCESS,
        },
        error: {
          type: types.CATERING_ORDER_PUT_ERROR,
        },
      },
    });
  });

  describe('deleteCateringOrder', () => {
    const orderId = 23;
    createApiTest({
      name: 'deleteCateringOrder',
      action: deleteCateringOrder,
      args: [orderId],
      tests: {
        method: 'DELETE',
        endpoint: buildAPIUrl(`catering_order/${orderId}`),
        request: {
          type: types.CATERING_ORDER_DELETE_REQUEST,
        },
        success: {
          type: types.CATERING_ORDER_DELETE_SUCCESS,
        },
        error: {
          type: types.CATERING_ORDER_DELETE_ERROR,
        },
      },
    });
  });
});
