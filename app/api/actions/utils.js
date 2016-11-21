import { camelizeKeys, decamelizeKeys } from 'humps';
import pickBy from 'lodash/pickBy';
import isEmpty from 'lodash/isEmpty';
import { normalize } from 'normalizr';
import { getJSON } from 'redux-api-middleware';

import actionTypes from '../actionTypes';

const requiredHeaders = {
  Accept: 'application/json',
  'Accept-Language': 'fi',
  'Content-Type': 'application/json',
};

function buildAPIUrl(endpoint, params) {
  let url = `${SETTINGS.API_URL}/${endpoint}/`;

  const nonEmptyParams = pickBy(params, value => value !== '');

  if (!isEmpty(nonEmptyParams)) {
    url = `${url}?${getSearchParamsString(nonEmptyParams)}`;
  }

  return url;
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

function getSearchParamsString(params) {
  const decamelized = decamelizeKeys(params);
  const parts = [];

  Object.keys(decamelized).forEach((key) => {
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(decamelized[key])}`);
  });

  return parts.join('&');
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
  createTransformFunction,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getRequestTypeDescriptors,
  getSearchParamsString,
  getSuccessTypeDescriptor,
  requiredHeaders,
};
