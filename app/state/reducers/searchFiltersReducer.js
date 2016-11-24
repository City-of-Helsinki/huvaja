import { handleActions } from 'redux-actions';

const initialState = {
  search: '',
};

export default handleActions({
  ENTER_OR_CHANGE_SEARCH_PAGE: (state, action) => {
    const filters = action.payload.query;
    return { ...initialState, ...filters };
  },
}, initialState);
