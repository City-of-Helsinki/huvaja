import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { dataReducer } from 'api/reducers';
import search from './searchReducer';

export default combineReducers({
  data: dataReducer,
  form: formReducer,
  search,
});
