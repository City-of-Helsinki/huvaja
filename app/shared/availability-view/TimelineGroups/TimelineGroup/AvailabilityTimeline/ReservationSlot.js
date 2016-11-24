import queryString from 'query-string';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import utils from '../utils';

ReservationSlot.propTypes = {
  begin: PropTypes.shape({
    format: PropTypes.func.isRequired,
  }).isRequired,
  resourceId: PropTypes.string.isRequired,
};
export default function ReservationSlot(props) {
  const query = queryString.stringify({
    begin: props.begin.format(),
    reserve: true,
  });
  return (
    <Link
      className="reservation-slot"
      style={{ width: utils.getTimeSlotWidth() }}
      to={`/resources/${props.resourceId}?${query}`}
    >
      <span className="a11y-text">Make reservation</span>
    </Link>
  );
}
