import { camelizeKeys, decamelizeKeys } from 'humps';
import pickBy from 'lodash/pickBy';
import { normalize } from 'normalizr';
import queryString from 'query-string';
import { CALL_API, getJSON } from 'redux-api-middleware';

import actionTypes from '../actionTypes';

// Helpers
// -------

export const requiredHeaders = {
  Accept: 'application/json',
  'Accept-Language': 'fi',
  'Content-Type': 'application/json',
};

export function buildAPIUrl(endpoint, params) {
  const url = `${SETTINGS.API_URL}${endpoint}/`;
  const nonEmptyParams = pickBy(params, value => value !== '');
  const paramsString = queryString.stringify(decamelizeKeys(nonEmptyParams));
  return paramsString ? `${url}?${paramsString}` : url;
}

export function createTransformFunction(schema) {
  return (json) => {
    const camelizedJson = camelizeKeys(json);
    if (schema) {
      return normalize(camelizedJson, schema);
    }
    return camelizedJson;
  };
}

export function getErrorTypeDescriptor(type, options = {}) {
  return {
    type,
    meta: Object.assign({}, options.meta, options.errorMeta),
  };
}

export function getHeadersCreator(headers) {
  return (state) => {
    const authorizationHeaders = {};
    if (state.auth && state.auth.token) {
      authorizationHeaders.Authorization = `JWT ${state.auth.token}`;
    }
    return Object.assign({}, requiredHeaders, headers, authorizationHeaders);
  };
}

export function getRequestTypeDescriptor(type, options = {}) {
  return {
    type,
    meta: Object.assign({}, options.meta, options.requestMeta),
  };
}

export function getRequestTypeDescriptors(type, method, options = {}) {
  return [
    getRequestTypeDescriptor(actionTypes[`${type}_${method}_REQUEST`], options),
    getSuccessTypeDescriptor(actionTypes[`${type}_${method}_SUCCESS`], options),
    getErrorTypeDescriptor(actionTypes[`${type}_${method}_ERROR`], options),
  ];
}

export function getSuccessPayload(options) {
  return (action, state, response) => (
    getJSON(response).then(createTransformFunction(options.schema))
  );
}

export function getSuccessTypeDescriptor(type, options = {}) {
  return {
    type,
    payload: options.payload || getSuccessPayload(options),
    meta: Object.assign({}, options.meta, options.successMeta),
  };
}

// The createApiAction function
// ----------------------------

function createApiAction({
  endpoint,
  type,
  method,
  body,
  params = {},
  options = {},
  headers = {},
}) {
  return {
    [CALL_API]: {
      types: getRequestTypeDescriptors(type, method, options),
      endpoint: buildAPIUrl(endpoint, params),
      method,
      headers: getHeadersCreator(headers),
      body,
    },
  };
}

export default createApiAction;
