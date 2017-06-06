import schemas from './schemas';
import { createApiAction } from './utils';

function fetchUnits() {
  return createApiAction({
    endpoint: 'unit',
    params: { pageSize: 100, resource_group: 'kanslia' },
    method: 'GET',
    type: 'UNITS',
    options: { schema: schemas.paginatedUnitsSchema },
  });
}

export {
  fetchUnits,  // eslint-disable-line import/prefer-default-export
};
