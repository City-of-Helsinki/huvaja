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
  create('RESERVATION', ['GET', 'DELETE', 'POST', 'PUT']),
  create('RESERVATIONS', ['GET']),
  create('RESOURCE', ['GET']),
  create('RESOURCE_FAVORITE', ['POST']),
  create('RESOURCE_UNFAVORITE', ['POST']),
  create('RESOURCES', ['GET']),
  create('UNITS', ['GET']),
);
