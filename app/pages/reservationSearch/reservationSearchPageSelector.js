import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import moment from 'moment';
import { createSelector, createStructuredSelector } from 'reselect';

import { reservationsGetIsActiveSelector } from 'api/selectors';

function searchFiltersSelector(state) {
  return state.reservationSearchPage.searchFilters;
}

function unitsSelector(state) {
  return state.data.units;
}

const reservationsSelector = createSelector(
  state => state.data.reservations,
  state => state.reservationSearchPage.searchResults,
  (reservations, reservationIds) => reservationIds.map(id => reservations[id])
);

const resultCountSelector = createSelector(
  state => state.reservationSearchPage.searchResults,
  reservationIds => reservationIds.length
);

const reservationGroupsSelector = createSelector(
  reservationsSelector,
  (reservations) => {
    if (!reservations.length) {
      return [];
    }
    const groupedReservations = groupBy(
      reservations,
      reservation => moment(reservation.begin).format('YYYY-MM-DD'),
    );
    const groups = Object.keys(groupedReservations).map((day) => {
      const reservationIds = (
        sortBy(groupedReservations[day], 'begin', 'end', 'id')
        .map(reservation => reservation.id)
      );
      return {
        day: moment(day),
        reservations: reservationIds,
      };
    });
    return sortBy(groups, 'day');
  }
);

export default createStructuredSelector({
  isFetching: reservationsGetIsActiveSelector,
  reservationGroups: reservationGroupsSelector,
  resultsCount: resultCountSelector,
  searchFilters: searchFiltersSelector,
  units: unitsSelector,
});
