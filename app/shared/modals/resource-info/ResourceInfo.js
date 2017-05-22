import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';

import ResourceInfo from 'shared/resource-info';

ResourceInfoModal.propTypes = {
  hideResourceImages: PropTypes.func.isRequired,
  hideResourceInfo: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  resource: PropTypes.object,
  show: PropTypes.bool.isRequired,
  showResourceImages: PropTypes.func.isRequired,
  unit: PropTypes.object,
};
export default function ResourceInfoModal(props) {
  const {
    hideResourceImages,
    hideResourceInfo,
    onHide,
    resource,
    show,
    showResourceImages,
    unit,
  } = props;
  return (
    <Modal
      bsSize="large"
      className="resource-info-modal"
      onHide={onHide}
      show={show}
    >
      <Modal.Body>
        {resource && unit ?
          <ResourceInfo
            hideResourceImages={hideResourceImages}
            resource={resource}
            resourceSearchUrl={null}
            showResourceImages={showResourceImages}
            unit={unit}
          /> :
          <div />
        }
      </Modal.Body>
      <Modal.Footer>
        <Button
          bsStyle="default"
          onClick={hideResourceInfo}
        >
          Sulje
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
