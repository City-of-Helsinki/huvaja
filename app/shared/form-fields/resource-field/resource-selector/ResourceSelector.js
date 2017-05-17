import React, { PropTypes } from 'react';
import Loader from 'react-loader';

import ResourceItem from './ResourceItem';

function renderResources(resources, onSelect, available) {
  if (!resources.length) return 'Ei tiloja';
  return resources.map(resource =>
    <ResourceItem
      available={available}
      id={resource.id}
      key={resource.id}
      label={resource.label}
      onSelect={onSelect}
      peopleCapacity={resource.peopleCapacity}
    />
  );
}

ResourceSelector.propTypes = {
  availableResources: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  unavailableResources: PropTypes.array.isRequired,
};
export default function ResourceSelector({
  availableResources,
  isFetching,
  onSelect,
  unavailableResources,
}) {
  return (
    <div className="resource-selector">
      <Loader loaded={!isFetching}>
        <div className="resource-list resource-list-available">
          <h4 className="resource-list-heading">Vapaana olevat tilat</h4>
          {renderResources(availableResources, onSelect, true)}
        </div>
        <div className="resource-list resource-list-unavailable">
          <h4 className="resource-list-heading">Varattuna olevat tilat</h4>
          {renderResources(unavailableResources, onSelect, false)}
        </div>
      </Loader>
    </div>
  );
}
