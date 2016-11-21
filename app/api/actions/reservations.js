import createApiAction from './createApiAction';
import schemas from './schemas';

function fetchReservations(params = {}) {
  return createApiAction({
    endpoint: 'reservation',
    params: Object.assign({}, params, { pageSize: 100 }),
    method: 'GET',
    type: 'RESERVATIONS',
    options: { schema: schemas.paginatedReservationsSchema },
  });
}

export {
  fetchReservations,  // eslint-disable-line
};
