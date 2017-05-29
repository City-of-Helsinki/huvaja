import mapValues from 'lodash/mapValues';
import orderBy from 'lodash/orderBy';
import { createSelector, createStructuredSelector } from 'reselect';

const showSelector = state => state.modals.reservationSuccess.show;
const createdSelector = state => orderBy(
  state.modals.reservationSuccess.created,
  'begin'
);
const failedReservationsSelector = state => orderBy(
  state.modals.reservationSuccess.failed,
  'begin'
);
const editedSelector = state => state.modals.reservationSuccess.edited;

function resourcesSelector(state) {
  return state.data.resources;
}

function unitsSelector(state) {
  return state.data.units;
}

const resourceNamesSelector = createSelector(
  resourcesSelector,
  unitsSelector,
  (resources, units) => mapValues(resources, (resource) => {
    const unit = units[resource.unit];
    const unitName = unit && unit.name.fi;
    return unitName ?
      `${unitName} / ${resource.name.fi}` :
      null;
  })
);

export default createStructuredSelector({
  createdReservations: createdSelector,
  editedReservation: editedSelector,
  failedReservations: failedReservationsSelector,
  resourceNames: resourceNamesSelector,
  show: showSelector,
});
