import React, { PropTypes } from 'react';
import Modal from 'react-bootstrap/lib/Modal';

import CompactReservationList from 'shared/compact-reservation-list';

const beginFormat = 'dd, D.M.YYYY HH:mm';
const endFormat = 'HH:mm';

function getListTitle(edited, createdReservations) {
  if (edited) return 'Yhtä tilavarausta on muokattu';
  const successCount = createdReservations.length;
  return successCount === 1 ?
    `Sinulle on tehty ${successCount} tilavaraus` :
    `Sinulle on tehty ${successCount} tilavarausta`;
}

ReservationSuccessModal.propTypes = {
  createdReservations: PropTypes.array.isRequired,
  editedReservation: PropTypes.object,
  failedReservations: PropTypes.array.isRequired,
  onHide: PropTypes.func.isRequired,
  resourceNames: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
};
function ReservationSuccessModal({
  createdReservations,
  editedReservation,
  failedReservations,
  onHide,
  resourceNames,
  show,
}) {
  const edited = Boolean(editedReservation);
  const mainTitle = edited ?
    'Varauksen muokkaus onnistui' :
    'Varauksesi on kirjattu';
  const listTitle = getListTitle(edited, createdReservations);
  const reservations = edited ? [editedReservation] : createdReservations;
  return (
    <Modal
      bsSize="large"
      className="reservation-success-modal"
      onHide={onHide}
      show={show}
    >
      <Modal.Header closeButton>
        <h2 className="reservation-success-modal-main-title">{mainTitle}</h2>
      </Modal.Header>
      <Modal.Body>
        <div className="reservation-success-modal-section">
          <h5 className="reservation-success-modal-list-title">{listTitle}</h5>
          <CompactReservationList
            beginFormat={beginFormat}
            className="reservations-list"
            endFormat={endFormat}
            reservations={reservations}
            resourceNames={resourceNames}
            success
          />
        </div>
        {Boolean(failedReservations.length) &&
          <div className="reservation-success-modal-section">
            <h5 className="reservation-success-modal-list-title">
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
    </Modal>
  );
}

export default ReservationSuccessModal;
