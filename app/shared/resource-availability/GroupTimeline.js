import React, { PropTypes } from 'react';

import ResourceReservationsTimelineContainer from './ResourceReservationsTimelineContainer';
import utils from './utils';

function getHourRanges(date) {
  const ranges = [];
  const current = date.clone();
  const end = date.clone().add(1, 'day');
  while (current.isBefore(end)) {
    ranges.push({ startTime: current.clone(), endTime: current.clone().add(1, 'hour') });
    current.add(1, 'hour');
  }
  return ranges;
}

GroupTimeline.propTypes = {
  date: PropTypes.object.isRequired,
  resources: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default function GroupTimeline(props) {
  return (
    <div className="group-timeline">
      <div className="hours">
        {getHourRanges(props.date).map(range =>
          <div
            className="hour"
            key={range.startTime.format('HH')}
            style={{ width: utils.getTimeSlotWidth(range) }}
          >
            {range.startTime.format('HH:mm')}
          </div>
        )}
      </div>
      {props.resources.map(resource =>
        <ResourceReservationsTimelineContainer date={props.date} id={resource} key={resource} />
      )}
    </div>
  );
}
