
import moment from 'moment';
import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Modal from 'react-bootstrap/lib/Modal';
import Row from 'react-bootstrap/lib/Row';

import constants from 'constants/AppConstants';
import ResourceSelector from 'shared/form-fields/resource-field/resource-selector';

function getFormattedDate(dateTimeRange) {
  return (
    dateTimeRange &&
    moment(dateTimeRange.begin.date).format(constants.DATE_FORMAT)
  );
}

function getFormattedTimeRange(dateTimeRange) {
  return (
    dateTimeRange &&
    dateTimeRange.begin.time &&
    dateTimeRange.end.time &&
    `${dateTimeRange.begin.time} - ${dateTimeRange.end.time}`
  );
}

ResourceSelectorModal.propTypes = {
  allowedCateringProvider: PropTypes.object,
  onHide: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedResource: PropTypes.object,
  selectedTimeRange: PropTypes.object,
  show: PropTypes.bool.isRequired,
  unit: PropTypes.object,
};
export default function ResourceSelectorModal(props) {
  const {
    allowedCateringProvider,
    onHide,
    onSelect,
    selectedResource,
    selectedTimeRange,
    show,
    unit,
  } = props;
  return (
    <Modal className="resource-selector-modal" onHide={onHide} show={show}>
      <Modal.Header closeButton>
        <h2>Vaihda tila</h2>
      </Modal.Header>
      <Modal.Body>
        <div className="current-selection">
          <Row>
            <Col sm={6}>
              <div className="current-resource">
                <div className="current-unit-name top-row">
                  {unit && unit.name.fi}
                </div>
                <div className="current-resource-name bottom-row">
                  {selectedResource && selectedResource.name.fi}
                </div>
              </div>
            </Col>
            <Col sm={6}>
              <div className="current-datetime-range">
                <div className="current-date top-row">{getFormattedDate(selectedTimeRange)}</div>
                <div className="current-time-range bottom-row">{getFormattedTimeRange(selectedTimeRange)}</div>
              </div>
            </Col>
          </Row>
        </div>
        <ResourceSelector
          allowedCateringProvider={allowedCateringProvider}
          onSelect={onSelect}
          selectedResourceId={selectedResource && selectedResource.id}
          selectedTimeRange={selectedTimeRange}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="default" onClick={onHide}>Peruuta</Button>
      </Modal.Footer>
    </Modal>
  );
}
