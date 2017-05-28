import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';

import CompactReservationList from 'shared/compact-reservation-list';

const beginFormat = 'dd, D.M.YYYY HH:mm';
const endFormat = 'HH:mm';

ReservationSuccessModal.propTypes = {
  createdReservations: PropTypes.array.isRequired,
  failedReservations: PropTypes.array.isRequired,
  onHide: PropTypes.func.isRequired,
  resourceNames: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
};
function ReservationSuccessModal({
  createdReservations,
  failedReservations,
  onHide,
  resourceNames,
  show,
}) {
  const successCount = createdReservations.length;
  const title = successCount === 1 ?
    `Sinulle on tehty ${successCount} tilavaraus` :
    `Sinulle on tehty ${successCount} tilavarausta`;
  return (
    <Modal
      bsSize="large"
      className="reservation-success-modal"
      onHide={onHide}
      show={show}
    >
      <Modal.Header closeButton>
        <h2>Varauksesi on kirjattu</h2>
      </Modal.Header>
      <Modal.Body>
        <div className="reservation-success-modal-section">
          <h5 className="reservation-success-modal-heading">{title}</h5>
          <CompactReservationList
            beginFormat={beginFormat}
            className="reservations-list"
            endFormat={endFormat}
            reservations={createdReservations}
            resourceNames={resourceNames}
            success
          />
        </div>
        {Boolean(failedReservations.length) &&
          <div className="reservation-success-modal-section">
            <h5 className="reservation-success-modal-heading">
              Seuraavien varausten tekeminen ei onnistunut
            </h5>
            <CompactReservationList
              beginFormat={beginFormat}
              endFormat={endFormat}
              failure
              className="failed-reservations-list"
              reservations={failedReservations}
              resourceNames={resourceNames}
              subtitle="failReason"
            />
          </div>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button
          bsStyle="default"
          onClick={onHide}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ReservationSuccessModal;
