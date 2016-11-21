function getTimeSlotWidth({ startTime, endTime } = {}) {
  const slotSize = 30; // minutes
  const slotWidth = 30; // pixels
  const slotMargin = 2; // pixels

  const diff = endTime ? endTime.diff(startTime, 'minutes') : slotSize;
  const slots = Math.floor(diff / slotSize);

  return (slotWidth * slots) - slotMargin;
}

export default {
  getTimeSlotWidth,
};
