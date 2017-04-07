import moment from 'moment';
import React, { PropTypes } from 'react';
import Col from 'react-bootstrap/lib/Col';
import Label from 'react-bootstrap/lib/Label';
import Modal from 'react-bootstrap/lib/Modal';
import Row from 'react-bootstrap/lib/Row';

import WrappedText from 'shared/wrapped-text';

ReservationInfoModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  unit: PropTypes.object.isRequired,
};

export default function ReservationInfoModal(props) {
  const {
    onHide,
    reservation,
    resource,
    show,
    unit,
  } = props;

  const placeholderEquipment = [{
    id: 'Piirtoheitin',
    name: { fi: 'Piirtoheitin' },
  }];
  const startTime = moment(reservation.begin);
  const endTime = moment(reservation.end);
  const date = startTime.format('dd D.M.YYYY');
  const time = `${startTime.format('HH:mm')} - ${endTime.format('HH:mm')}`;
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
            <div className="details-value">{reservation.numberOfParticipants}</div>
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
          <Col className="details-row reservation-equipment" xs={6}>
            <div className="details-label">Tilatut varusteet: </div>
            {
              placeholderEquipment.map(item =>
                <Label bsStyle="primary" key={`label-${item.id}`}>{item.name.fi}</Label>
              )
            }
          </Col>
        </Row>
        <hr />
        {reservation.eventDescription && (
          <Row>
            <Col className="details-row reservation-additional-info" xs={6}>
              <div className="details-label">Lisätiedot: </div>
              <WrappedText className="details-text" text={reservation.eventDescription} />
            </Col>
          </Row>
        )}
      </Modal.Body>
    </Modal>
  );
}
