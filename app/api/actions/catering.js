import { decamelizeKeys } from 'humps';

import cateringUtils from 'utils/cateringUtils';
import schemas from './schemas';
import { createApiAction } from './utils';

export function fetchCateringProducts(providerId) {
  return createApiAction({
    endpoint: 'catering_product',
    params: { resource_group: 'kanslia', provider: providerId, pageSize: 1000 },
    method: 'GET',
    type: 'CATERING_PRODUCTS',
    options: { schema: schemas.paginatedCateringProductsSchema },
  });
}

export function fetchCateringProductCategories(providerId) {
  return createApiAction({
    endpoint: 'catering_product_category',
    params: { resource_group: 'kanslia', provider: providerId, pageSize: 1000 },
    method: 'GET',
    type: 'CATERING_PRODUCT_CATEGORIES',
    options: { schema: schemas.paginatedCateringProductCategoriesSchema },
  });
}

export function fetchCateringProviders() {
  return createApiAction({
    endpoint: 'catering_provider',
    params: { resource_group: 'kanslia' },
    method: 'GET',
    type: 'CATERING_PROVIDERS',
    options: { schema: schemas.paginatedCateringProvidersSchema },
  });
}

export function makeCateringOrder(order, options) {
  return createApiAction({
    endpoint: 'catering_order',
    method: 'POST',
    type: 'CATERING_ORDER',
    body: processCateringOrderData(order),
    options,
  });
}

export function fetchCateringOrder(reservationId) {
  return createApiAction({
    endpoint: 'catering_order',
    params: { reservation: reservationId },
    method: 'GET',
    type: 'CATERING_ORDER',
    options: { schema: schemas.paginatedCateringOrdersSchema },
  });
}

export function editCateringOrder(cateringOrder, options) {
  return createApiAction({
    endpoint: `catering_order/${cateringOrder.id}`,
    method: 'PUT',
    type: 'CATERING_ORDER',
    body: processCateringOrderData(cateringOrder),
    options,
  });
}

export function deleteCateringOrder(cateringOrderId, options) {
  return createApiAction({
    endpoint: `catering_order/${cateringOrderId}`,
    method: 'DELETE',
    type: 'CATERING_ORDER',
    options,
  });
}

function processCateringOrderData(orderData) {
  const cateringOrder = cateringUtils.formValueToCateringOrder(orderData);
  return JSON.stringify(decamelizeKeys(cateringOrder));
}
