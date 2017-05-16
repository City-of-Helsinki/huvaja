import moment from 'moment';
import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Row from 'react-bootstrap/lib/Row';
import { Field, reduxForm } from 'redux-form';

import ReduxFormField from 'shared/form-fields/ReduxFormField';
import CateringSection from './catering';

const requiredFields = [
  'eventSubject',
  'hostName',
  'numberOfParticipants',
  'reserverName',
  'resource',
  'time',
];

function constructMoment(value) {
  const dateString = `${value.date}T${value.time}:00.000`;
  return moment(dateString, moment.ISO_8601, true);
}

function didResourceChange(old, current) {
  const currentId = current && current.id;
  const oldId = old && old.id;
  return Boolean(currentId && currentId !== oldId);
}

export function validate(values) {
  const errors = {};
  requiredFields.forEach((value) => {
    if (!values[value]) {
      errors[value] = 'Pakollinen tieto';
    }
  });

  if (!errors.time) {
    const begin = constructMoment(values.time.begin);
    const end = constructMoment(values.time.end);
    if (begin.isValid() && end.isValid()) {
      if (!begin.isBefore(end)) {
        errors.time = 'Alkamisajan on oltava ennen loppumisaikaa';
      } else {
        const pattern = /^\d\d:[03]0$/;
        const areTimesValid = (
          pattern.exec(values.time.begin.time) &&
          pattern.exec(values.time.end.time)
        );
        if (!areTimesValid) {
          errors.time = 'Ajan on päätyttävä :00 tai :30';
        }
      }
    } else {
      errors.time = 'Epäkelpo päivä tai aika';
    }
  }

  return errors;
}

function renderField(name, type, label, controlProps = {}) {
  const required = requiredFields.indexOf(name) !== -1;
  return (
    <Field
      component={ReduxFormField}
      controlProps={controlProps}
      label={`${label}${required ? '*' : ''}`}
      name={name}
      type={type}
    />
  );
}

export class UnconnectedReservationForm extends React.Component {
  componentDidMount() {
    if (this.props.resource) {
      this.props.fetchResource(
        this.props.resource.id,
        { date: this.props.timelineDate }
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const hasTimelineChanged = (
      this.props.timelineDate !== nextProps.timelineDate ||
      didResourceChange(this.props.resource, nextProps.resource)
    );
    if (hasTimelineChanged && nextProps.resource) {
      this.props.fetchResource(
        nextProps.resource.id, { date: nextProps.timelineDate }
      );
    }
  }

  render() {
    return (
      <div>
        <form className="reservation-form" onSubmit={this.props.handleSubmit}>
          <div>
            <Row>
              <Col md={6}>
                <h3>Tila ja aika</h3>
                {renderField(
                  'resource',
                  'resource',
                  'Tila',
                  {
                    resource: this.props.resource,
                    timeRange: this.props.timeRange,
                  }
                )}
                {renderField(
                  'time',
                  'date-time-range',
                  'Varauksen aika',
                  { required: true },
                )}
              </Col>
              {this.props.resource &&
                <Col md={12}>
                  <div className="timeline-container">
                    <h5>Varaustilanne</h5>
                    <p className="help-text">Voit valita ajan myös maalaamalla.</p>
                    {renderField(
                      'time',
                      'reservation-time',
                      'Aika',
                      {
                        date: this.props.timelineDate,
                        excludeReservation: this.props.reservation && this.props.reservation.id,
                        hideDateSelector: true,
                        resource: this.props.resource,
                        onDateChange: () => null,
                      }
                    )}
                  </div>
                </Col>
              }
            </Row>
            <Row>
              <Col md={6}>
                <h3>Perustiedot</h3>
                {renderField(
                  'eventSubject',
                  'text',
                  'Varauksen otsikko',
                )}
                {renderField(
                  'reserverName',
                  'text',
                  'Varaaja',
                )}
                {renderField(
                  'hostName',
                  'text',
                  'Varauksen isäntä',
                )}
              </Col>
              <Col md={6}>
                <h3>Osallistujat</h3>
                {renderField(
                  'numberOfParticipants',
                  'number',
                  'Osallistujien määrä',
                  { min: 1 },
                )}
                {renderField(
                  'participantList',
                  'textarea',
                  'Lista osallistujista',
                  { rows: 6 },
                )}
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <CateringSection />
              </Col>
              <Col md={6}>
                <h3>Muuta</h3>
                {renderField(
                  'eventDescription',
                  'textarea',
                  'Lisätietoja',
                  { rows: 6 },
                )}
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                {this.props.error && (
                  <div className="has-error">
                    <HelpBlock>{this.props.error}</HelpBlock>
                  </div>
                )}
                <div className="form-controls">
                  <Button bsStyle="primary" type="submit">
                    {this.props.submitting ? 'Tallennetaan...' : 'Tallenna varaus'}
                  </Button>
                  <Button bsStyle="default">Peruuta</Button>
                </div>
              </Col>
            </Row>
          </div>
        </form>
      </div>
    );
  }
}

UnconnectedReservationForm.propTypes = {
  error: PropTypes.string,
  fetchResource: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  reservation: PropTypes.object,
  resource: PropTypes.object,
  submitting: PropTypes.bool.isRequired,
  timeRange: PropTypes.object,
  timelineDate: PropTypes.string.isRequired,
};

export default reduxForm({
  form: 'resourceReservation',
  validate,
})(UnconnectedReservationForm);
