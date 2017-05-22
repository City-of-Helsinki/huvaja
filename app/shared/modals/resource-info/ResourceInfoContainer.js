import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import uiActions from 'actions/uiActions';
import ResourceInfoModal from './ResourceInfo';
import selector from './resourceInfoSelector';

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
