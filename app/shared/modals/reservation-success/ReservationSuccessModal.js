import classNames from 'classnames';
import React, { PropTypes } from 'react';
import Modal from 'react-bootstrap/lib/Modal';

import CompactReservationList from 'shared/compact-reservation-list';

function getListTitle(edited, createdReservations) {
  if (edited) return 'Yhtä tilavarausta on muokattu';
  const successCount = createdReservations.length;
  return successCount === 1 ?
    `Sinulle on tehty ${successCount} tilavaraus` :
    `Sinulle on tehty ${successCount} tilavarausta`;
}

function getCateringOrderItem(cateringOrderResult) {
  if (!cateringOrderResult) return null;
  const baseClass = 'reservation-success-modal-catering-order';
  const className = classNames(
    baseClass,
    `${baseClass}-${cateringOrderResult.split('-')[1]}`
  );
  return (
    <div className={className}>
      {getCateringOrderText(cateringOrderResult)}
    </div>
  );
}

function getCateringOrderText(cateringOrderResult) {
  switch (cateringOrderResult) {
    case 'POST-success':
      return 'Tilaisuuden tarjoilutilaus on lähetetty palveluntarjoajalle.';
    case 'PUT-success':
      return 'Tilaisuuden muokattu tarjoilutilaus on lähetetty palveluntarjoajalle.';
    case 'DELETE-success':
      return 'Tilaisuuden tarjoilutilaus on poistettu.';
    case 'POST-error':
      return 'Tilaisuuden tarjoilutilauksen tekeminen epäonnistui.';
    case 'PUT-error':
      return 'Tilaisuuden tarjoilutilauksen muokkaus epäonnistui.';
    case 'DELETE-error':
      return 'Tilaisuuden tarjoilutilauksen poistaminen epäonnistui.';
    default:
      throw new Error('Unknown cateringOrderResult.');
  }
}

ReservationSuccessModal.propTypes = {
  cateringOrderResult: PropTypes.oneOf([
    'DELETE-error',
    'DELETE-success',
    'POST-error',
    'POST-success',
    'PUT-error',
    'PUT-success',
  ]),
  createdReservations: PropTypes.array.isRequired,
  editedReservation: PropTypes.object,
  failedReservations: PropTypes.array.isRequired,
  onHide: PropTypes.func.isRequired,
  resourceNames: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
};
function ReservationSuccessModal({
  cateringOrderResult,
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
            className="reservations-list"
            reservations={reservations}
            resourceNames={resourceNames}
            success
          />
          {getCateringOrderItem(cateringOrderResult)}
        </div>
        {Boolean(failedReservations.length) &&
          <div className="reservation-success-modal-section">
            <h5 className="reservation-success-modal-list-title">
              Seuraavien varausten tekeminen ei onnistunut
            </h5>
            <CompactReservationList
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
