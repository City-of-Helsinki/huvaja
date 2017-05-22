import React, { PropTypes } from 'react';
import Sticky from 'react-sticky-el';

import AvailabilityViewResourceInfoContainer from './AvailabilityViewResourceInfo';

GroupInfo.propTypes = {
  date: PropTypes.string.isRequired,
  highlightedResourceId: PropTypes.string,
  name: PropTypes.string.isRequired,
  resources: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default function GroupInfo(props) {
  const { date, highlightedResourceId } = props;
  return (
    <div className="group-info" title={props.name}>
      <Sticky>
        <div className="group-name"><div className="name">{props.name}</div></div>
      </Sticky>
      {props.resources.map(resource =>
        <AvailabilityViewResourceInfoContainer
          date={date}
          id={resource}
          isHighlighted={highlightedResourceId === resource}
          key={resource}
        />
      )}
    </div>
  );
}
