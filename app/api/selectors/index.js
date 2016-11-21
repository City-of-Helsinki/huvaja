import actionTypes from '../actionTypes';
import createRequestIsActiveSelector from './createRequestIsActiveSelector';

const resourceGetIsActiveSelector = createRequestIsActiveSelector(
  actionTypes.RESOURCE_GET_REQUEST
);

const resourcePostIsActiveSelector = createRequestIsActiveSelector(
  actionTypes.RESOURCE_POST_REQUEST
);

const resourcesGetIsActiveSelector = createRequestIsActiveSelector(
  actionTypes.RESOURCES_GET_REQUEST
);

const unitsGetIsActiveSelector = createRequestIsActiveSelector(
  actionTypes.UNITS_GET_REQUEST
);

export {
  resourceGetIsActiveSelector,
  resourcePostIsActiveSelector,
  resourcesGetIsActiveSelector,
  unitsGetIsActiveSelector,
};
