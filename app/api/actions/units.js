import schemas from './schemas';
import createApiAction from './createApiAction';

function fetchUnits() {
  return createApiAction({
    endpoint: 'unit',
    params: { pageSize: 100 },
    method: 'GET',
    type: 'UNITS',
    options: { schema: schemas.paginatedUnitsSchema },
  });
}

export {
  fetchUnits,  // eslint-disable-line import/prefer-default-export
};
