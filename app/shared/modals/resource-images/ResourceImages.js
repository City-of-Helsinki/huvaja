import React, { PropTypes } from 'react';
import Modal from 'react-bootstrap/lib/Modal';

import ImageCarousel from 'shared/image-carousel';

ResourceImagesModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
};
export default function ResourceImagesModal(props) {
  const {
    onHide,
    resource,
    show,
  } = props;
  return (
    <Modal
      bsSize="large"
      onHide={onHide}
      show={show}
    >
      <Modal.Header closeButton>
        <h2>{resource.name.fi}</h2>
      </Modal.Header>
      <Modal.Body>
        <ImageCarousel images={resource.images} />
      </Modal.Body>
    </Modal>
  );
}
