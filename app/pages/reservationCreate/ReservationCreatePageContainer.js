import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import React, { PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';

import { ReservationCreateForm } from 'shared/reservation-form';

function resourcesSelector(state) {
  return state.data.resources;
}

function resourceIdSelector(state, props) {
  return props.location.query.resource;
}

const resourceSelector = createSelector(
  resourcesSelector,
  resourceIdSelector,
  (resources, resourceId) => resources[resourceId]
);

const isFetchingSelector = createSelector(
  resourcesSelector,
  resources => isEmpty(resources)
);

export const selector = createStructuredSelector({
  isFetching: isFetchingSelector,
  resource: resourceSelector,
});

UnconnectedReservationCreatePageContainer.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    query: PropTypes.object.Required,
  }),
  resource: PropTypes.object,
};
export function UnconnectedReservationCreatePageContainer(props) {
  return (
    <div>
      <h1>Varauksen tekeminen</h1>
      <Loader loaded={!props.isFetching}>
        <ReservationCreateForm
          begin={props.location.query.begin || moment().format('YYYY-MM-DD')}
          end={props.location.query.end}
          initialResource={props.resource}
        />
      </Loader>
    </div>
  );
}

export default connect(selector)(UnconnectedReservationCreatePageContainer);
