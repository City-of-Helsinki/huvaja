import some from 'lodash/some';
import moment from 'moment';

import { slotSize, slotWidth, slotMargin } from 'shared/availability-view';

function getTimeSlotWidth({ startTime, endTime } = {}) {
  const diff = endTime ? endTime.diff(startTime, 'minutes') : slotSize;
  const slots = Math.floor(diff / slotSize);

  return (slotWidth * slots) - slotMargin;
}

function isInsideOpeningHours(item, openingHours) {
  return some(openingHours, opening => (
    item.begin.isSameOrAfter(opening.opens) && item.end.isSameOrBefore(opening.closes)
  ));
}

function getTimelineItems(date, reservations, resource, excludeReservation) {
  const items = [];
  let reservationPointer = 0;
  let timePointer = date.clone().startOf('day');
  const end = date.clone().endOf('day');
  while (timePointer.isBefore(end)) {
    const reservation = reservations && reservations[reservationPointer];
    if (reservation && reservation.id === excludeReservation) {
      reservationPointer += 1;
      continue; // eslint-disable-line no-continue
    }
    const isSlotReservation = reservation && timePointer.isSame(reservation.begin);
    if (isSlotReservation) {
      items.push({
        key: String(items.length),
        type: 'reservation',
        data: reservation,
      });
      timePointer = moment(reservation.end);
      reservationPointer += 1;
    } else {
      const data = {
        begin: timePointer.clone(),
        end: timePointer.clone().add(slotSize, 'minutes'),
      };
      items.push({
        key: String(items.length),
        type: 'reservation-slot',
        data: {
          ...data,
          isSelectable: isInsideOpeningHours(data, resource.openingHours),
          resourceId: resource.id,
        },
      });
      timePointer.add(slotSize, 'minutes');
    }
  }
  return items;
}

export default {
  getTimelineItems,
  getTimeSlotWidth,
};
