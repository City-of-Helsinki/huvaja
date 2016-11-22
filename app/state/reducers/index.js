import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { activeRequestsReducer, dataReducer } from 'api/reducers';
import searchPage from './searchPageReducer';

export default combineReducers({
  activeRequests: activeRequestsReducer,
  data: dataReducer,
  form: formReducer,
  searchPage,
});
