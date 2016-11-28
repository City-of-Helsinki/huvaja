import React, { PropTypes } from 'react';

import TimelineGroup from './TimelineGroup';

TimelineGroups.propTypes = {
  date: PropTypes.string.isRequired,
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};
export default function TimelineGroups(props) {
  return (
    <div className="timeline-groups">
      {props.groups.map(group => <TimelineGroup date={props.date} key={group.name} {...group} />)}
    </div>
  );
}
