import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';

import uiActions from 'actions/uiActions';
import ResourceInfoModal from './ResourceInfo';

function resourcesSelector(state) {
  return state.data.resources;
}

function resourceIdSelector(state) {
  return state.modals.resourceInfo.resourceId;
}

const resourceSelector = createSelector(
  resourcesSelector,
  resourceIdSelector,
  (resources, id) => resources[id]
);

function showSelector(state) {
  return state.modals.resourceInfo.show;
}

function unitsSelector(state) {
  return state.data.units;
}

const unitSelector = createSelector(
  unitsSelector,
  resourceSelector,
  (units, resource) => resource && units[resource.unit]
);

const selector = createStructuredSelector({
  resource: resourceSelector,
  show: showSelector,
  unit: unitSelector,
});

UnconnectedResourceInfoContainer.propTypes = {
  hideResourceImages: PropTypes.func.isRequired,
  hideResourceInfo: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  resource: PropTypes.object,
  show: PropTypes.bool.isRequired,
  showResourceImages: PropTypes.func.isRequired,
  unit: PropTypes.object,
};
export function UnconnectedResourceInfoContainer({
  hideResourceImages,
  hideResourceInfo,
  onHide,
  resource,
  show,
  showResourceImages,
  unit,
}) {
  return (
    <ResourceInfoModal
      hideResourceImages={hideResourceImages}
      hideResourceInfo={hideResourceInfo}
      onHide={onHide}
      resource={resource}
      show={show}
      showResourceImages={showResourceImages}
      unit={unit}
    />
  );
}

const actions = {
  hideResourceImages: uiActions.hideResourceImagesModal,
  hideResourceInfo: uiActions.hideResourceInfoModal,
  onHide: uiActions.hideResourceInfoModal,
  showResourceImages: uiActions.showResourceImagesModal,
};

export default connect(selector, actions)(UnconnectedResourceInfoContainer);
