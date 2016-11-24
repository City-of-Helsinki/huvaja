import moment from 'moment';
import React, { PropTypes } from 'react';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import utils from '../utils';

function getTooltipId(startTime, endTime, name) {
  const start = startTime.format('HHmm');
  const end = endTime.format('HHmm');
  return `tooltip-${start}-${end}-${name.replace(/\s/g, '-')}`;
}

Reservation.propTypes = {
  end: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  begin: PropTypes.string.isRequired,
};
export default function Reservation(props) {
  const startTime = moment(props.begin);
  const endTime = moment(props.end);
  const width = utils.getTimeSlotWidth({ startTime, endTime });
  const tooltip = (
    <Tooltip id={getTooltipId(startTime, endTime, props.name)}>
      {startTime.format('HH:mm')} - {endTime.format('HH:mm')} {props.name}
    </Tooltip>
  );
  return (
    <OverlayTrigger overlay={tooltip}>
      <div className="reservation" style={{ width }}>
        <div className="times">
          <div className="start-time">{startTime.format('HH:mm')}</div>
          <div className="end-time">{endTime.format('HH:mm')}</div>
        </div>
        <div className="name">{props.name}</div>
      </div>
    </OverlayTrigger>
  );
}
