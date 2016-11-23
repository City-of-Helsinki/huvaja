import React, { PropTypes } from 'react';

import DateSelector from './DateSelector';
import GroupedTimeline from './GroupedTimeline';
import Sidebar from './Sidebar';

ResourceAvailability.propTypes = {
  date: PropTypes.object.isRequired,
  groups: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDateChange: PropTypes.func.isRequired,
};
export default function ResourceAvailability(props) {
  return (
    <div className="resource-availability">
      <div className="left">
        <div className="top-left" />
        <Sidebar groups={props.groups} />
      </div>
      <div className="right">
        <DateSelector value={props.date} onChange={props.onDateChange} />
        <GroupedTimeline date={props.date} groups={props.groups} />
      </div>
    </div>
  );
}

