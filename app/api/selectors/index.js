import actionTypes from '../actionTypes';
import createCateringProviderSelector from './createCateringProviderSelector';
import createRequestIsActiveSelector from './createRequestIsActiveSelector';

const reservationDeleteIsActiveSelector = createRequestIsActiveSelector(
  actionTypes.RESERVATION_DELETE_REQUEST
);

const reservationGetIsActiveSelector = createRequestIsActiveSelector(
  actionTypes.RESERVATION_GET_REQUEST
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
  createCateringProviderSelector,
  reservationDeleteIsActiveSelector,
  reservationGetIsActiveSelector,
  reservationsGetIsActiveSelector,
  resourceGetIsActiveSelector,
  resourcePostIsActiveSelector,
  resourcesGetIsActiveSelector,
  unitsGetIsActiveSelector,
};
