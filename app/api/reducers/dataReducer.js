import mapValues from 'lodash/mapValues';
import reject from 'lodash/reject';
import immutable from 'seamless-immutable';

import cateringMenuItems from './cateringMenuItemsExampleData';
import actionTypes from '../actionTypes';

const initialState = immutable({
  cateringMenuItems,
  comments: {},
  equipment: {},
  reservations: {},
  resources: {},
  types: {},
  units: {},
});

function getCommentsMockData() {
  return [
    {
      id: 1,
      content: 'Is it possible to have a 1:1 scale replica of Hogwarts in the room?',
      createdAt: '2017-01-01T10:18:39Z',
      user: { name: 'S. Snape' },
    },
    {
      id: 2,
      content: 'Best I can do is a 1:1 replica of Hogsmeade. Will that do?',
      createdAt: '2017-01-01T11:07:11Z',
      user: { name: 'Argus Filch' },
    },
    {
      id: 3,
      content: 'That will have to do.',
      createdAt: '2017-01-01T11:13:08Z',
      user: { name: 'S. Snape' },
    },
  ];
}

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

    case actionTypes.EQUIPMENT_GET_SUCCESS:
    case actionTypes.RESERVATIONS_GET_SUCCESS:
    case actionTypes.RESERVATION_GET_SUCCESS:
    case actionTypes.RESOURCE_GET_SUCCESS:
    case actionTypes.TYPES_GET_SUCCESS:
    case actionTypes.UNITS_GET_SUCCESS: {
      return handleData(state, action.payload.entities);
    }

    case actionTypes.COMMENTS_GET_SUCCESS:
    case actionTypes.COMMENTS_GET_ERROR: {
      return state.merge({
        comments: state.comments.merge({
          [action.meta.reservationId]: getCommentsMockData(),
        }),
      });
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
