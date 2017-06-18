import moment from 'moment';
import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Modal from 'react-bootstrap/lib/Modal';
import Row from 'react-bootstrap/lib/Row';
import { Link } from 'react-router';

import constants from 'constants/AppConstants';
import CateringOrderTable from 'shared/catering-order-table';
import Comments from 'shared/comments';
import ReservationDetailsReportButton from 'shared/reservation-details-report-button';
import WrappedText from 'shared/wrapped-text';
import cateringUtils from 'utils/cateringUtils';

ReservationInfoModal.propTypes = {
  cateringOrder: PropTypes.object,
  cateringOrderItems: PropTypes.array.isRequired,
  onHide: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  showReservationCancelModal: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};

export default function ReservationInfoModal(props) {
  const {
    cateringOrder,
    cateringOrderItems,
    onHide,
    reservation,
    resource,
    show,
    showReservationCancelModal,
    unit,
  } = props;
  const startTime = moment(reservation.begin);
  const endTime = moment(reservation.end);
  const date = startTime.format(constants.DATE_FORMAT);
  const time = `${startTime.format(constants.TIME_FORMAT)} - ${endTime.format(constants.TIME_FORMAT)}`;
  const cancelReservation = () => showReservationCancelModal(reservation.id);
  const { canDelete, canModify } = reservation.userPermissions;
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
        {cateringOrder && cateringOrderItems.length &&
          <Row>
            <Col className="details-row reservation-catering" xs={12}>
              <div className="details-label">Tilattu tarjoilu: </div>
              <CateringOrderTable items={cateringOrderItems} narrow noHeader />
            </Col>
            <Col className="details-row serving-time" xs={6}>
              <div className="details-label">Tarjoiluaika: </div>
              <div className="details-value">
                {cateringUtils.getServingTimeText(cateringOrder.servingTime)}
              </div>
            </Col>
            <Col className="details-row catering-invoicing-data" xs={6}>
              <div className="details-label">Projektinumero (laskutustieto): </div>
              <div className="details-value">
                {cateringOrder.invoicingData}
              </div>
            </Col>
            {cateringOrder.message &&
              <Col className="details-row catering-message" xs={12}>
                <div className="details-label">
                  Lisätietoja tarjoilun toimittajalle:
                </div>
                <WrappedText
                  className="details-value"
                  text={cateringOrder.message}
                />
              </Col>
            }
            <Col className="details-row" xs={12}>
              <Comments
                cateringId={cateringOrder.id}
                className="catering-comments"
                name="Tarjoilun viestit"
              />
              <hr />
            </Col>
          </Row>
        }
        {reservation.eventDescription && (
          <Row>
            <Col className="details-row reservation-additional-info" xs={6}>
              <div className="details-label">Lisätiedot: </div>
              <div className="details-value">
                <WrappedText text={reservation.eventDescription} />
              </div>
            </Col>
          </Row>
        )}
        <Comments
          className="reservation-comments"
          name="Varauksen viestit"
          reservationId={reservation.id}
        />
        <hr />
        <Row>
          <Col className="details-row reservation-participants" xs={12}>
            <div className="details-label">Lista osallistujista: </div>
            <WrappedText className="details-value" text={reservation.participants || ''} />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <ReservationDetailsReportButton reservationId={reservation.id} />
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
    </Modal>
  );
}
