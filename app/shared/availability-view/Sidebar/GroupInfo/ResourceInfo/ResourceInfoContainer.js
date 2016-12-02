import React, { PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { createSelector } from 'reselect';

ResourceInfo.propTypes = {
  id: PropTypes.string.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  peopleCapacity: PropTypes.number.isRequired,
};
export function ResourceInfo(props) {
  return (
    <div className="resource-info">
      <div className="name">
        { props.isFavorite && <Glyphicon className="favorite-icon" glyph="heart" /> }
        <Link to={`/resources/${props.id}`}>
          {props.name}
        </Link>
      </div>
      <div className="capacity">
        <Glyphicon glyph="user" /> {props.peopleCapacity}
      </div>
    </div>
  );
}

export function selector() {
  function idSelector(state, props) { return props.id; }
  function resourcesSelector(state) {
    return state.data.resources;
  }
  const resourceSelector = createSelector(
    resourcesSelector,
    idSelector,
    (resources, id) => resources[id]
  );
  return createSelector(
    resourceSelector,
    resource => ({
      isFavorite: resource.isFavorite,
      name: resource.name.fi,
      peopleCapacity: resource.peopleCapacity,
    })
  );
}

const ResourceInfoContainer = connect(selector)(ResourceInfo);
ResourceInfoContainer.propTypes = {
  id: PropTypes.string.isRequired,
};
export default ResourceInfoContainer;
