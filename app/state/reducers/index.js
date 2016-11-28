import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { activeRequestsReducer, dataReducer } from 'api/reducers';
import resourcePage from './resourcePageReducer';
import searchFilters from './searchFiltersReducer';
import searchResults from './searchResultsReducer';

export default combineReducers({
  activeRequests: activeRequestsReducer,
  data: dataReducer,
  form: formReducer,
  resourcePage,
  searchPage: combineReducers({
    searchFilters,
    searchResults,
  }),
});
