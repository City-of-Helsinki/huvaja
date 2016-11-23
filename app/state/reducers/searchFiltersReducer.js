const initialState = {
  search: '',
};

function searchFiltersReducer(state = initialState, action) {
  switch (action.type) {
    case 'ENTER_OR_CHANGE_SEARCH_PAGE': {
      const filters = action.payload.query;
      return Object.assign({}, initialState, filters);
    }

    default: {
      return state;
    }
  }
}

export default searchFiltersReducer;
