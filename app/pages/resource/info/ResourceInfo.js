import React, { PropTypes } from 'react';

function ResourceInfo({ resource, unit }) {
  return (
    <div className="resource-info">
      <h1>
        <span className="unit-name">{unit.name.fi}</span>
        {' '}
        <span className="resource-name">{resource.name.fi}</span>
      </h1>
    </div>
  );
}

ResourceInfo.propTypes = {
  resource: PropTypes.object.isRequired,  // eslint-disable-line
  unit: PropTypes.object.isRequired,  // eslint-disable-line
};

export default ResourceInfo;
