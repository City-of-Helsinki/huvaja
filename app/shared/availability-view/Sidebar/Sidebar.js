import React, { PropTypes } from 'react';

import GroupInfo from './GroupInfo';

Sidebar.propTypes = {
  date: PropTypes.string.isRequired,
  groups: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string.isRequired })
  ).isRequired,
  highlightedResourceId: PropTypes.string,
};
export default function Sidebar(props) {
  const { date, highlightedResourceId } = props;
  return (
    <div className="sidebar">
      {props.groups.map(group => (
        <GroupInfo
          date={date}
          highlightedResourceId={highlightedResourceId}
          key={group.name}
          {...group}
        />
      ))}
    </div>
  );
}
