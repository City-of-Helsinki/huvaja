import keyBy from 'lodash/keyBy';

function create(name, methods = []) {
  return methods.reduce((memo, method) => (
    Object.assign(memo, keyBy([
      `${name}_${method}_REQUEST`,
      `${name}_${method}_SUCCESS`,
      `${name}_${method}_ERROR`,
    ]))
  ), {});
}

export default Object.assign(
  {},
  create('CATERING_ORDER', ['POST']),
  create('CATERING_PRODUCTS', ['GET']),
  create('CATERING_PRODUCT_CATEGORIES', ['GET']),
  create('CATERING_PROVIDERS', ['GET']),
  create('COMMENTS', ['GET', 'POST']),
  create('EQUIPMENT', ['GET']),
  create('RESERVATION', ['GET', 'DELETE', 'POST', 'PUT']),
  create('RESERVATIONS', ['GET']),
  create('RESOURCE', ['GET']),
  create('RESOURCE_DAILY_REPORT', ['GET']),
  create('RESOURCE_FAVORITE', ['POST']),
  create('RESOURCE_UNFAVORITE', ['POST']),
  create('RESOURCES', ['GET']),
  create('TYPES', ['GET']),
  create('UNITS', ['GET']),
);
