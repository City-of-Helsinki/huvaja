import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { activeRequestsReducer, dataReducer } from 'api/reducers';
import searchFilters from './searchFiltersReducer';
import searchResults from './searchResultsReducer';

export default combineReducers({
  activeRequests: activeRequestsReducer,
  data: dataReducer,
  form: formReducer,
  searchPage: combineReducers({
    searchFilters,
    searchResults,
  }),
});
