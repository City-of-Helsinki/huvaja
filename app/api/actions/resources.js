import moment from 'moment';

import createApiAction from './createApiAction';
import schemas from './schemas';

function fetchFavoritedResources(date) {
  const params = { date, is_favorite: true };
  return fetchResources(params);
}

function fetchResource(id, params = {}) {
  return createApiAction({
    endpoint: `resource/${id}`,
    params: getParamsWithTimes(params),
    method: 'GET',
    type: 'RESOURCE',
    options: { schema: schemas.resourceSchema },
  });
}

function fetchResources(params = {}) {
  return createApiAction({
    endpoint: 'resource',
    params: { ...getParamsWithTimes(params), pageSize: 100 },
    method: 'GET',
    type: 'RESOURCES',
    options: { schema: schemas.paginatedResourcesSchema },
  });
}

function favoriteResource(id) {
  return createApiAction({
    endpoint: `resource/${id}/favorite`,
    method: 'POST',
    type: 'RESOURCE_FAVORITE',
    options: { meta: { id } },
  });
}

function unfavoriteResource(id) {
  return createApiAction({
    endpoint: `resource/${id}/unfavorite`,
    method: 'POST',
    type: 'RESOURCE_UNFAVORITE',
    options: { meta: { id } },
  });
}

function getParamsWithTimes(params = {}) {
  const date = params.date ? moment(params.date) : moment();
  const times = {
    end: date.endOf('day').toISOString(),
    start: date.startOf('day').toISOString(),
  };
  const rv = { ...params, ...times };
  delete rv.date;
  return rv;
}

export {
  favoriteResource,
  fetchFavoritedResources,
  fetchResource,
  fetchResources,
  getParamsWithTimes,
  unfavoriteResource,
};
