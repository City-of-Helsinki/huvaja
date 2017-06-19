import classNames from 'classnames';
import React, { PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { createSelector } from 'reselect';

AvailabilityViewResourceInfo.propTypes = {
  canMakeReservations: PropTypes.bool.isRequired,
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool,
  name: PropTypes.string.isRequired,
  peopleCapacity: PropTypes.number.isRequired,
};
export function AvailabilityViewResourceInfo(props) {
  return (
    <div
      className={classNames(
        'availability-view-resource-info',
        {
          'availability-view-resource-info-highlighted': props.isHighlighted,
          'availability-view-resource-info-can-make-reservations': props.canMakeReservations,
        },
      )}
      title={props.name}
    >
      <div className="name">
        { props.isFavorite && <FontAwesome className="favorite-icon" name="heart" /> }
        <Link to={`/resources/${props.id}?begin=${props.date}`}>
          {props.name}
        </Link>
      </div>
      <div className="capacity">
        <span className="chair-icon" /> {props.peopleCapacity}
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
      canMakeReservations: resource.userPermissions.canMakeReservations,
      isFavorite: resource.isFavorite,
      name: resource.name.fi,
      peopleCapacity: resource.peopleCapacity,
    })
  );
}

const AvailabilityViewResourceInfoContainer = connect(selector)(AvailabilityViewResourceInfo);
AvailabilityViewResourceInfoContainer.propTypes = {
  id: PropTypes.string.isRequired,
};
export default AvailabilityViewResourceInfoContainer;
