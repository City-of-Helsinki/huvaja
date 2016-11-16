import { combineReducers } from 'redux';

import { dataReducer } from 'api/reducers';
import search from './searchReducer';

export default combineReducers({
  data: dataReducer,
  search,
});
