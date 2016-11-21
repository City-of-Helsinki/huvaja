import moment from 'moment';
import React, { PropTypes } from 'react';

import utils from './utils';

Reservation.propTypes = {
  end: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  begin: PropTypes.string.isRequired,
};

export default function Reservation(props) {
  const startTime = moment(props.begin);
  const endTime = moment(props.end);
  const width = utils.getTimeSlotWidth({ startTime, endTime });
  return (
    <div className="reservation" style={{ width }}>
      <div className="times">
        <div className="start-time">{startTime.format('HH:mm')}</div>
        <div className="end-time">{endTime.format('HH:mm')}</div>
      </div>
      <div className="name">{props.name}</div>
    </div>
  );
}
