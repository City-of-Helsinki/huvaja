import { CALL_API } from 'redux-api-middleware';

import types from './actionTypes';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from './utils';
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
  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.RESOURCE_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.RESOURCE_GET_SUCCESS,
          { schema: schemas.resourceSchema }
        ),
        getErrorTypeDescriptor(types.RESOURCE_GET_ERROR),
      ],
      endpoint: buildAPIUrl(`resource/${id}`, params),
      method: 'GET',
      headers: getHeadersCreator(),
    },
  };
}

function fetchResources(params = {}) {
  const fetchParams = Object.assign({}, params, { pageSize: 100 });

  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.RESOURCES_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.RESOURCES_GET_SUCCESS,
          {
            schema: schemas.paginatedResourcesSchema,
          }
        ),
        getErrorTypeDescriptor(types.RESOURCES_GET_ERROR),
      ],
      endpoint: buildAPIUrl('resource', fetchParams),
      method: 'GET',
      headers: getHeadersCreator(),
    },
  };
}

function favoriteResource(id) {
  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.RESOURCE_FAVORITE_POST_REQUEST),
        getSuccessTypeDescriptor(
          types.RESOURCE_FAVORITE_POST_SUCCESS,
          { meta: { id } },
        ),
        getErrorTypeDescriptor(types.RESOURCE_FAVORITE_POST_ERROR),
      ],
      endpoint: buildAPIUrl(`resource/${id}/favorite`),
      method: 'POST',
      headers: getHeadersCreator(),
    },
  };
}

function unfavoriteResource(id) {
  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.RESOURCE_UNFAVORITE_POST_REQUEST),
        getSuccessTypeDescriptor(
          types.RESOURCE_UNFAVORITE_POST_SUCCESS,
          { meta: { id } },
        ),
        getErrorTypeDescriptor(types.RESOURCE_UNFAVORITE_POST_ERROR),
      ],
      endpoint: buildAPIUrl(`resource/${id}/unfavorite`),
      method: 'POST',
      headers: getHeadersCreator(),
    },
  };
}


export {
  favoriteResource,
  fetchFavoritedResources,
  fetchResource,
  fetchResources,
  unfavoriteResource,
};
