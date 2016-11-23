import actionTypes from 'api/actionTypes';

const initialState = [];

function searchFiltersReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.RESOURCES_GET_SUCCESS: {
      const resourceIds = Object.keys(action.payload.entities.resources || {});
      return resourceIds;
    }

    default: {
      return state;
    }
  }
}

export default searchFiltersReducer;
