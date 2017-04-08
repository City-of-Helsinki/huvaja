import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';

ReservationCancelModal.propTypes = {
  cancelReservation: PropTypes.func.isRequired,
  isCancelling: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
};
export default function ReservationCancelModal(props) {
  const {
    cancelReservation,
    isCancelling,
    onHide,
    reservation,
    show,
  } = props;
  const cancel = () => cancelReservation(reservation);
  return (
    <Modal
      className="reservation-cancel-modal"
      onHide={onHide}
      show={show}
    >
      <Modal.Header closeButton>
        <h2>Vahvista varauksen poistaminen</h2>
      </Modal.Header>
      <Modal.Body>
        <p>Oletko varma, että haluat poistaa tämän varauksen?</p>
        <Button className="confirm-button" bsStyle="danger" onClick={cancel}>
          {isCancelling ? 'Poistetaan...' : 'Poista varaus'}
        </Button>
        <Button bsStyle="default" onClick={onHide}>Älä poista</Button>
      </Modal.Body>
    </Modal>
  );
}
