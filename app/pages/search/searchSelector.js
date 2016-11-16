import values from 'lodash/values';
import { createStructuredSelector } from 'reselect';

function messageSelector(state) {
  return state.search.message;
}

function resourcesSelector(state) {
  return values(state.data.resources);
}

export default createStructuredSelector({
  message: messageSelector,
  resources: resourcesSelector,
});
