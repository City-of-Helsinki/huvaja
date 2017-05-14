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

function fetchResources(params = {}, times = true, meta) {
  const defaultParams = {
    resource_group: 'kanslia',
    pageSize: 100,
  };
  const paramsWithTimes = times ? getParamsWithTimes(params) : params;
  return createApiAction({
    endpoint: 'resource',
    params: {
      ...defaultParams,
      ...paramsWithTimes,
    },
    method: 'GET',
    type: 'RESOURCES',
    options: { meta, schema: schemas.paginatedResourcesSchema },
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
