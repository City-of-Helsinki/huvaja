import mapValues from 'lodash/mapValues';
import reject from 'lodash/reject';
import immutable from 'seamless-immutable';

import cateringMenuItems from './cateringMenuItemsExampleData';
import actionTypes from '../actionTypes';

const initialState = immutable({
  cateringMenuItems,
  reservations: {},
  resources: {},
  units: {},
});

function handleData(state, data) {
  return state.merge(data, { deep: true });
}

function handleReservation(state, reservation) {
  const entities = {
    reservations: {
      [reservation.id]: reservation,
    },
  };

  if (state.resources[reservation.resource]) {
    const reservations = reject(
      state.resources[reservation.resource].reservations,
      current => current.id === reservation.id
    );
    entities.resources = {
      [reservation.resource]: {
        reservations: [...reservations, reservation],
      },
    };
  }

  return handleData(state, entities);
}

function dataReducer(state = initialState, action) {
  switch (action.type) {

    case actionTypes.RESERVATIONS_GET_SUCCESS:
    case actionTypes.RESERVATION_GET_SUCCESS:
    case actionTypes.RESOURCE_GET_SUCCESS:
    case actionTypes.UNITS_GET_SUCCESS: {
      return handleData(state, action.payload.entities);
    }

    case actionTypes.RESOURCES_GET_SUCCESS: {
      const resources = mapValues(action.payload.entities.resources, (resource) => {
        if (!resource.reservations) {
          delete resource.reservations; // eslint-disable-line no-param-reassign
        }
        return resource;
      });
      return handleData(state, { resources });
    }

    case actionTypes.RESERVATION_DELETE_SUCCESS: {
      const reservation = Object.assign({}, action.payload, { state: 'cancelled' });
      return handleReservation(state, reservation);
    }

    case actionTypes.RESERVATION_POST_SUCCESS:
    case actionTypes.RESERVATION_PUT_SUCCESS: {
      return handleReservation(state, action.payload);
    }

    case actionTypes.RESOURCE_UNFAVORITE_POST_SUCCESS: {
      const id = action.meta.id;
      return state.setIn(['resources', id, 'isFavorite'], false);
    }

    case actionTypes.RESOURCE_FAVORITE_POST_SUCCESS: {
      const id = action.meta.id;
      return state.setIn(['resources', id, 'isFavorite'], true);
    }

    default: {
      return state;
    }
  }
}

export default dataReducer;
export { handleData };
