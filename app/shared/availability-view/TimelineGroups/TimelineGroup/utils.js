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

function roundDateToSlotSize(date, roundSlotSize, direction) {
  if ((60 % roundSlotSize) !== 0) {
    throw new RangeError('60 must be divisible by roundSlotSize');
  }
  if (!date) {
    return null;
  }
  const slotDate = moment(date);
  const modulo = slotDate.minute() % roundSlotSize;
  if (modulo === 0) {
    return moment(date);
  }
  if (direction > 0) {
    slotDate.add(roundSlotSize - modulo, 'minutes');
  } else if (direction < 0) {
    slotDate.subtract(modulo, 'minutes');
  }
  return slotDate;
}

function getTimelineItems(date, reservations, resource, excludeReservation) {
  const items = [];
  let reservationPointer = 0;
  let timePointer = date.clone().startOf('day');
  const end = date.clone().endOf('day');
  let previousReservationEnd = null;
  while (timePointer.isBefore(end)) {
    const reservation = reservations && reservations[reservationPointer];
    if (reservation && reservation.id === excludeReservation) {
      reservationPointer += 1;
      continue; // eslint-disable-line no-continue
    }
    let visualBegin = null;
    if (reservation && previousReservationEnd &&
        previousReservationEnd.isAfter(reservation.begin)) {
        // This is a rare edge case where the previous reservation
        // ends between slots at t0 and the current reservation begins
        // at the same t0.
        //
        // The former reservation ending has already been rounded up,
        // overlapping the current reservation, the beginning of which
        // thus cannot be rounded down. They are just forced to equal.
      visualBegin = previousReservationEnd;
    } else {
      visualBegin = reservation && roundDateToSlotSize(reservation.begin, slotSize, -1);
    }
    const visualEnd = reservation && roundDateToSlotSize(reservation.end, slotSize, 1);
    const isSlotReservation = reservation && timePointer.isSame(visualBegin);
    const key = String(items.length);
    if (isSlotReservation) {
      items.push({
        key,
        type: 'reservation',
        data: { ...reservation,
          visualBegin: visualBegin.format('YYYY-MM-DDTHH:mm:ss'),
          visualEnd: visualEnd.format('YYYY-MM-DDTHH:mm:ss') },
      });
      timePointer = moment(visualEnd);
      reservationPointer += 1;
      previousReservationEnd = visualEnd;
    } else {
      const data = {
        begin: timePointer.clone(),
        end: timePointer.clone().add(slotSize, 'minutes'),
      };
      items.push({
        key,
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
