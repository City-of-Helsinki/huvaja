import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import uiActions from 'actions/uiActions';
import resourceImagesModalSelector from './resourceImagesSelector';
import ResourceImages from './ResourceImages';

UnconnectedResourceImagesContainer.propTypes = {
  onHide: PropTypes.func.isRequired,
  resource: PropTypes.object,
  show: PropTypes.bool.isRequired,
};
export function UnconnectedResourceImagesContainer(props) {
  return (props.resource ?
    <ResourceImages
      onHide={props.onHide}
      resource={props.resource}
      show={props.show}
    /> :
    <div />
  );
}

const actions = {
  onHide: uiActions.hideResourceImagesModal,
};

export default connect(resourceImagesModalSelector, actions)(
  UnconnectedResourceImagesContainer
);
