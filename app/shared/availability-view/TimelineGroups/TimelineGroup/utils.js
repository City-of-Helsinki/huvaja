import moment from 'moment';

const slotSize = 30; // minutes
const slotWidth = 30; // pixels
const slotMargin = 2; // pixels

function getTimeSlotWidth({ startTime, endTime } = {}) {
  const diff = endTime ? endTime.diff(startTime, 'minutes') : slotSize;
  const slots = Math.floor(diff / slotSize);

  return (slotWidth * slots) - slotMargin;
}

function getTimelineItems(date, reservations, resourceId) {
  const items = [];
  let reservationPointer = 0;
  let timePointer = date.clone().startOf('day');
  const end = date.clone().endOf('day');
  while (timePointer.isBefore(end)) {
    const reservation = reservations && reservations[reservationPointer];
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
      items.push({
        key: String(items.length),
        type: 'reservation-slot',
        data: {
          begin: timePointer.clone(),
          end: timePointer.clone().add(slotSize, 'minutes'),
          resourceId,
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
