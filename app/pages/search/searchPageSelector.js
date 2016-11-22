import values from 'lodash/values';
import { createStructuredSelector } from 'reselect';

import { resourcesGetIsActiveSelector } from 'api/selectors';

function resourcesSelector(state) {
  return values(state.data.resources);
}

export default createStructuredSelector({
  isFetching: resourcesGetIsActiveSelector,
  resources: resourcesSelector,
});
