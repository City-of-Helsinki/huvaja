import schemas from './schemas';
import createApiAction from './createApiAction';

function fetchTypes() {
  return createApiAction({
    endpoint: 'type',
    params: { pageSize: 100 },
    method: 'GET',
    type: 'TYPES',
    options: { schema: schemas.paginatedTypesSchema },
  });
}

export {
  fetchTypes,  // eslint-disable-line import/prefer-default-export
};
