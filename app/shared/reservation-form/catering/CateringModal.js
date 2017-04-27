import React, { PropTypes } from 'react';
import Modal from 'react-bootstrap/lib/Modal';

import CateringForm from './catering-form';

CateringModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

function CateringModal(props) {
  return (
    <Modal className="catering-modal" onHide={props.onClose} show={props.show}>
      <Modal.Header closeButton>
        <Modal.Title>Lisää tarjoilutilaus</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CateringForm onCancelCallback={props.onClose} onSubmitCallback={props.onClose} />
      </Modal.Body>
    </Modal>
  );
}

export default CateringModal;
