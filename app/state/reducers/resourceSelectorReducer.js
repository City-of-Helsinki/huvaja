import { handleActions } from 'redux-actions';

import actionTypes from 'api/actionTypes';

function getInitialState() {
  return {
    availableResourceIds: [],
  };
}

export default handleActions({
  [actionTypes.RESOURCES_GET_SUCCESS]: (state, action) => {
    if (!(action.meta && action.meta.resourceSelector)) return state;
    return {
      availableResourceIds: Object.keys(action.payload.entities.resources),
    };
  },
  CLEAR_RESOURCE_SELECTOR: () => getInitialState(),
}, getInitialState());
