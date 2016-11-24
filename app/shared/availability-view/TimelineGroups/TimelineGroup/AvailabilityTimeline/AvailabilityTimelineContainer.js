import sortBy from 'lodash/sortBy';
import { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import AvailabilityTimeline from './AvailabilityTimeline';
import utils from '../utils';

export function selector() {
  function dateSelector(state, props) { return props.date; }
  function resourceIdSelector(state, props) { return props.id; }
  function resourcesSelector(state) { return state.data.resources; }

  const formattedDateSelector = createSelector(
    dateSelector,
    date => date.format('YYYY-MM-DD')
  );
  const resourceSelector = createSelector(
    resourcesSelector,
    resourceIdSelector,
    (resources, id) => resources[id]
  );
  const reservationsSelector = createSelector(
    resourceSelector,
    formattedDateSelector,
    (resource, date) => resource.reservations && sortBy(
      resource.reservations.filter(reservation => reservation.begin.slice(0, 10) === date),
      'begin'
    )
  );
  const itemsSelector = createSelector(
    reservationsSelector,
    dateSelector,
    resourceIdSelector,
    (reservations, date, resourceId) => utils.getTimelineItems(date, reservations, resourceId)
  );

  return createSelector(
    itemsSelector,
    items => ({ items })
  );
}

const AvailabilityTimelineContainer = connect(selector)(AvailabilityTimeline);
AvailabilityTimelineContainer.propTypes = {
  date: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

export default AvailabilityTimelineContainer;
