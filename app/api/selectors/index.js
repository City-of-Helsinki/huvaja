import actionTypes from '../actionTypes';
import createRequestIsActiveSelector from './createRequestIsActiveSelector';

const reservationDeleteIsActiveSelector = createRequestIsActiveSelector(
  actionTypes.RESERVATION_DELETE_REQUEST
);

const reservationsGetIsActiveSelector = createRequestIsActiveSelector(
  actionTypes.RESERVATIONS_GET_REQUEST
);

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
  reservationDeleteIsActiveSelector,
  reservationsGetIsActiveSelector,
  resourceGetIsActiveSelector,
  resourcePostIsActiveSelector,
  resourcesGetIsActiveSelector,
  unitsGetIsActiveSelector,
};
