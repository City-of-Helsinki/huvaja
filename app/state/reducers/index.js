import { combineReducers } from 'redux';

import { dataReducer } from 'api/reducers';
import home from './homeReducer';

export default combineReducers({
  data: dataReducer,
  home,
});
