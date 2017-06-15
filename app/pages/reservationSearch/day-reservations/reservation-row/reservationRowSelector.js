import moment from 'moment';
import { createSelector } from 'reselect';

import resourceUtils from 'utils/resourceUtils';

function reservationsSelector(state) {
  return state.data.reservations;
}

function resourcesSelector(state) {
  return state.data.resources;
}

function unitsSelector(state) {
  return state.data.units;
}

function reservationIdSelector(state, props) {
  return props.id;
}

const reservationSelector = createSelector(
  reservationsSelector,
  reservationIdSelector,
  (reservations, reservationId) => reservations[reservationId]
);

const resourceSelector = createSelector(
  resourcesSelector,
  reservationSelector,
  (resources, reservation) => resources[reservation.resource]
);

const unitSelector = createSelector(
  unitsSelector,
  resourceSelector,
  (units, resource) => resource && units[resource.unit]
);

export default createSelector(
  reservationSelector,
  resourceSelector,
  unitSelector,
  (reservation, resource, unit) => {
    const begin = moment(reservation.begin).format('HH:mm');
    const end = moment(reservation.end).format('HH:mm');
    return {
      eventSubject: reservation.eventSubject || 'Tuntematon varauksen nimi',
      hasCateringOrder: reservation.hasCateringOrder,
      hostName: reservation.hostName || 'Tuntematon isäntä',
      id: reservation.id,
      numberOfParticipants: reservation.numberOfParticipants || null,
      place: resourceUtils.getLongName(resource, unit) || 'Tuntematon tila',
      timeRange: `${begin} - ${end}`,
    };
  }
);
