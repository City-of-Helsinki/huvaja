import { camelizeKeys, decamelizeKeys } from 'humps';
import pickBy from 'lodash/pickBy';
import { normalize } from 'normalizr';
import queryString from 'query-string';
import { CALL_API, getJSON } from 'redux-api-middleware';

import actionTypes from '../actionTypes';

const requiredHeaders = {
  Accept: 'application/json',
  'Accept-Language': 'fi',
  'Content-Type': 'application/json',
};

function buildAPIUrl(endpoint, params) {
  const url = `${SETTINGS.API_URL}${endpoint}/`;
  const nonEmptyParams = pickBy(params, value => value !== '');
  const paramsString = queryString.stringify(decamelizeKeys(nonEmptyParams));
  return paramsString ? `${url}?${paramsString}` : url;
}

function createApiAction({ endpoint, type, method, params = {}, options = {}, headers = {} }) {
  return {
    [CALL_API]: {
      types: getRequestTypeDescriptors(type, method, options),
      endpoint: buildAPIUrl(endpoint, params),
      method,
      headers: getHeadersCreator(headers),
    },
  };
}

function createTransformFunction(schema) {
  return (json) => {
    const camelizedJson = camelizeKeys(json);
    if (schema) {
      return normalize(camelizedJson, schema);
    }
    return camelizedJson;
  };
}

function getErrorTypeDescriptor(type, options = {}) {
  return {
    type,
    meta: Object.assign({}, options.meta, options.errorMeta),
  };
}

function getHeadersCreator(headers) {
  return (state) => {
    const authorizationHeaders = {};
    if (state.auth && state.auth.token) {
      authorizationHeaders.Authorization = `JWT ${state.auth.token}`;
    }
    return Object.assign({}, requiredHeaders, headers, authorizationHeaders);
  };
}

function getRequestTypeDescriptor(type, options = {}) {
  return {
    type,
    meta: Object.assign({}, options.meta, options.requestMeta),
  };
}

function getRequestTypeDescriptors(type, method, options = {}) {
  return [
    getRequestTypeDescriptor(actionTypes[`${type}_${method}_REQUEST`], options),
    getSuccessTypeDescriptor(actionTypes[`${type}_${method}_SUCCESS`], options),
    getErrorTypeDescriptor(actionTypes[`${type}_${method}_ERROR`], options),
  ];
}

function getSuccessPayload(options) {
  return (action, state, response) => (
    getJSON(response).then(createTransformFunction(options.schema))
  );
}

function getSuccessTypeDescriptor(type, options = {}) {
  return {
    type,
    payload: options.payload || getSuccessPayload(options),
    meta: Object.assign({}, options.meta, options.successMeta),
  };
}

export {
  buildAPIUrl,
  createApiAction,
  createTransformFunction,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getRequestTypeDescriptors,
  getSuccessTypeDescriptor,
  requiredHeaders,
};
