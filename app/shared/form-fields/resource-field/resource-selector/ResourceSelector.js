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

function renderResourceList(name, className, resources, onSelect, available) {
  return (
    <div className={`resource-list resource-list-${className}`}>
      <h4 className="resource-list-heading">{name}</h4>
      {renderResources(resources, onSelect, available)}
    </div>
  );
}

ResourceSelector.propTypes = {
  availableResources: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  resources: PropTypes.array,
  unavailableResources: PropTypes.array.isRequired,
};
export default function ResourceSelector({
  availableResources,
  isFetching,
  onSelect,
  resources,
  unavailableResources,
}) {
  return (
    <div className="resource-selector">
      <Loader loaded={!isFetching}>
        {resources && renderResourceList('Tilat', 'all', resources, onSelect, true)}
        {!resources && renderResourceList(
          'Vapaana olevat tilat',
          'available',
          availableResources,
          onSelect,
          true
        )}
        {!resources && renderResourceList(
          'Varattuna olevat tilat',
          'unavailable',
          unavailableResources,
          onSelect,
          false
        )}
      </Loader>
    </div>
  );
}
