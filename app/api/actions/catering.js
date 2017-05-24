import schemas from './schemas';
import createApiAction from './createApiAction';

function fetchCateringProviders() {
  return createApiAction({
    endpoint: 'catering_provider',
    params: { resource_group: 'kanslia' },
    method: 'GET',
    type: 'CATERING_PROVIDERS',
    options: { schema: schemas.paginatedCateringProvidersSchema },
  });
}

export {
  fetchCateringProviders,  // eslint-disable-line import/prefer-default-export
};
