import { decamelizeKeys } from 'humps';

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

function processCateringOrderData(orderData) {
  const { order, ...rest } = orderData;
  const data = {
    ...rest,
    orderLines: Object.keys(order).map(productId => ({
      product: productId,
      quantity: order[productId],
    })),
  };
  return JSON.stringify(decamelizeKeys(data));
}
