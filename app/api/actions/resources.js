import { createApiAction } from './utils';
import schemas from './schemas';

function fetchFavoritedResources(timeAsMoment, source) {
  const params = {
    end: timeAsMoment.endOf('day').toISOString(),
    is_favorite: true,
    start: timeAsMoment.startOf('day').toISOString(),
  };
  return fetchResources(params, source);
}

function fetchResource(id, params = {}) {
  return createApiAction({
    endpoint: `resource/${id}`,
    params,
    method: 'GET',
    type: 'RESOURCE',
    options: { schema: schemas.resourceSchema },
  });
}

function fetchResources(params = {}) {
  return createApiAction({
    endpoint: 'resource',
    params: Object.assign({}, params, { pageSize: 100 }),
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

export {
  favoriteResource,
  fetchFavoritedResources,
  fetchResource,
  fetchResources,
  unfavoriteResource,
};
