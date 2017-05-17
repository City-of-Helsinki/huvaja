import moment from 'moment';
import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Modal from 'react-bootstrap/lib/Modal';
import Row from 'react-bootstrap/lib/Row';
import { Link } from 'react-router';

import Comments from 'shared/comments';
import WrappedText from 'shared/wrapped-text';

ReservationInfoModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  showReservationCancelModal: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};

export default function ReservationInfoModal(props) {
  const {
    onHide,
    reservation,
    resource,
    show,
    showReservationCancelModal,
    unit,
  } = props;
  const startTime = moment(reservation.begin);
  const endTime = moment(reservation.end);
  const date = startTime.format('dd D.M.YYYY');
  const time = `${startTime.format('HH:mm')} - ${endTime.format('HH:mm')}`;
  const cancelReservation = () => showReservationCancelModal(reservation.id);
  const { canDelete, canModify } = reservation.userPermissions;
  const showFooter = canDelete || canModify;
  return (
    <Modal
      className="reservation-info-modal"
      onHide={onHide}
      show={show}
    >
      <Modal.Header closeButton>
        <Row>
          <Col className="details-row reservation-header" xs={6}>
            <h2 className="unit-name">{unit.name.fi}</h2>
            <h1 className="resource-name">{resource.name.fi}</h1>
          </Col>
          <Col className="details-row reservation-time" xs={6}>
            <div className="date">{date}</div>
            <div className="time">{time}</div>
          </Col>
        </Row>
      </Modal.Header>

      <Modal.Body>
        <h1 className="event-subject">{reservation.eventSubject}</h1>
        <hr />
        <Row>
          <Col className="details-row reservation-participants-number" xs={6}>
            <div className="details-label">Osallistujamäärä: </div>
            <div className="details-value">
              {reservation.numberOfParticipants || '-'}
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="details-row reservation-reserver" xs={6}>
            <div className="details-label">Varaaja: </div>
            <div className="details-value">{reservation.reserverName}</div>
          </Col>
          <Col className="details-row reservation-host" xs={6}>
            <div className="details-label">Tilaisuuden isäntä: </div>
            <div className="details-value">{reservation.hostName}</div>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col className="details-row reservation-catering" xs={6}>
            <div className="details-label">Tilattu tarjoilu: </div>
            <ul>
              <li className="details-item">Kahvi <span className="units">12 kpl</span></li>
              <li className="details-item">Paivän pulla <span className="units">12 kpl</span></li>
            </ul>
          </Col>
        </Row>
        <Comments
          cateringId={reservation.id}
          className="catering-comments"
          name="Tarjoilun viestit"
        />
        <hr />
        {reservation.eventDescription && (
          <Row>
            <Col className="details-row reservation-additional-info" xs={6}>
              <div className="details-label">Lisätiedot: </div>
              <WrappedText className="details-text" text={reservation.eventDescription} />
            </Col>
          </Row>
        )}
        <Comments
          className="reservation-comments"
          name="Varauksen viestit"
          reservationId={reservation.id}
        />
      </Modal.Body>
      {showFooter && (
        <Modal.Footer>
          {canDelete && (
            <Button
              className="reservation-cancel"
              bsStyle="default"
              onClick={cancelReservation}
            >
              Poista
            </Button>
          )}
          {canModify && (
            <Link
              className="btn btn-default reservation-edit"
              to={`/reservations/${reservation.id}/edit`}
            >
              Muokkaa
            </Link>
          )}
        </Modal.Footer>
      )}
    </Modal>
  );
}
