import mapValues from 'lodash/mapValues';
import immutable from 'seamless-immutable';

import actionTypes from '../actionTypes';

const initialState = immutable({
  resources: {},
  units: {},
});

function handleData(state, data) {
  return state.merge(data, { deep: true });
}

function dataReducer(state = initialState, action) {
  switch (action.type) {

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
