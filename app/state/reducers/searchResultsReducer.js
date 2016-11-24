import { handleActions } from 'redux-actions';

import actionTypes from 'api/actionTypes';

const initialState = [];

export default handleActions({
  [actionTypes.RESOURCES_GET_SUCCESS]: (state, action) => {
    const resourceIds = Object.keys(action.payload.entities.resources || {});
    return resourceIds;
  },
}, initialState);
