import React from 'react';

import utils from './utils';

export default function ReservationSlot() {
  return <div className="reservation-slot" style={{ width: utils.getTimeSlotWidth() }} />;
}
