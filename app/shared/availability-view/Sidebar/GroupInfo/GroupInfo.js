import React, { PropTypes } from 'react';

import ResourceInfoContainer from './ResourceInfo';

GroupInfo.propTypes = {
  date: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  resources: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default function GroupInfo(props) {
  return (
    <div className="group-info">
      <div className="group-name">{props.name}</div>
      {props.resources.map(resource =>
        <ResourceInfoContainer date={props.date} key={resource} id={resource} />
      )}
    </div>
  );
}
