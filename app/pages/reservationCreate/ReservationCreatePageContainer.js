import moment from 'moment';
import React, { PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { ReservationCreateForm } from 'shared/reservation-form';

function resourcesSelector(state) {
  return state.data.resources;
}

export const selector = createStructuredSelector({
  resources: resourcesSelector,
});

UnconnectedReservationCreatePageContainer.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.object.Required,
  }),
  resource: PropTypes.object,
};
export function UnconnectedReservationCreatePageContainer(props) {
  return (
    <div>
      <h1>Varauksen tekeminen</h1>
      <Loader loaded={Boolean(props.resource)}>
        <ReservationCreateForm
          begin={props.location.query.begin}
          date={props.location.query.begin || moment().format('YYYY-MM-DD')}
          end={props.location.query.end}
          resource={props.resource}
        />
      </Loader>
    </div>
  );
}

export function mergeProps(stateProps, dispatchProps, ownProps) {
  const { resources, ...props } = { ...ownProps, ...stateProps, ...dispatchProps };
  return {
    ...props,
    resource: resources[props.location.query.resource],
  };
}

export default connect(selector, null, mergeProps)(UnconnectedReservationCreatePageContainer);
