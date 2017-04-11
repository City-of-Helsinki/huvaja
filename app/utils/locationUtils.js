import { decamelizeKeys } from 'humps';
import queryString from 'query-string';

function getResourceSearchUrl(filters) {
  const decamelized = decamelizeKeys(filters);
  const urlParams = queryString.stringify(decamelized);
  return `/?${urlParams}`;
}

function redirect(url) {
  window.location = url;
}

export default {
  getResourceSearchUrl,
  redirect,
};
