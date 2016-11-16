import values from 'lodash/values';
import { createStructuredSelector } from 'reselect';

function resourcesSelector(state) {
  return values(state.data.resources);
}

export default createStructuredSelector({
  resources: resourcesSelector,
});
