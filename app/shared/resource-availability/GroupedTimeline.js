import React, { PropTypes } from 'react';

import GroupTimeline from './GroupTimeline';

GroupedTimeline.propTypes = {
  date: PropTypes.object.isRequired,
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};
export default function GroupedTimeline(props) {
  return (
    <div className="grouped-timeline">
      {props.groups.map(group => <GroupTimeline date={props.date} key={group.name} {...group} />)}
    </div>
  );
}
