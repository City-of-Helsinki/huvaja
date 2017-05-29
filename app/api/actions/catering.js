import schemas from './schemas';
import createApiAction from './createApiAction';

export function fetchCateringProducts(providerId) {
  return createApiAction({
    endpoint: 'catering_product',
    params: { resource_group: 'kanslia', provider: providerId },
    method: 'GET',
    type: 'CATERING_PRODUCTS',
    options: { schema: schemas.paginatedCateringProductsSchema },
  });
}

export function fetchCateringProductCategories(providerId) {
  return createApiAction({
    endpoint: 'catering_product_category',
    params: { resource_group: 'kanslia', provider: providerId },
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
