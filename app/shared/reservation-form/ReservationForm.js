import moment from 'moment';
import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Panel from 'react-bootstrap/lib/Panel';
import { Field, reduxForm } from 'redux-form';

import ReduxFormField from 'shared/form-fields/ReduxFormField';
import CateringSection from './catering';

const requiredFields = [
  'time',
  'eventName',
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

export function UnconnectedReservationForm(props) {
  return (
    <div>
      <form className="reservation-form" onSubmit={props.handleSubmit}>
        <div className="reservation-form-timeline">
          {renderField(
            'time',
            'reservation-time',
            'Aika',
            {
              date: props.date,
              resource: props.resource,
              onDateChange: props.onDateChange,
            }
          )}
        </div>
        {props.hasTime && <div>
          <Panel bsStyle="primary" header={<h4>Uusi varaus</h4>}>
            <h3>Perustiedot</h3>
            {renderField(
              'time',
              'date-time-range',
              'Varauksen aika',
              { required: true },
            )}
            {renderField(
              'resource',
              'text',
              'Tila',
              { disabled: true }
            )}
            {renderField(
              'eventName',
              'text',
              'Tapahtuma',
            )}
            {renderField(
              'reserverName',
              'text',
              'Varaaja',
            )}
            {renderField(
              'hostName',
              'text',
              'Isäntä',
            )}
            <h3>Osallistujat</h3>
            {renderField(
              'numberOfParticipants',
              'number',
              'Osallistujamäärä',
              { min: 1 },
            )}
            {renderField(
              'participantList',
              'textarea',
              'Lista osallistujista',
              { rows: 6 },
            )}
            <CateringSection />
            {renderField(
              'eventDescription',
              'textarea',
              'Lisätietoja',
              { rows: 6 },
            )}
            {props.error && (
              <div className="has-error">
                <HelpBlock>{props.error}</HelpBlock>
              </div>
            )}
            <div className="form-controls">
              <Button bsStyle="primary" type="submit">Tallenna varaus</Button>
              <Button bsStyle="default">Peruuta</Button>
            </div>
          </Panel>
        </div>}
      </form>
    </div>
  );
}

UnconnectedReservationForm.propTypes = {
  date: PropTypes.string.isRequired,
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  hasTime: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
  onDateChange: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'resourceReservation',
  validate,
})(UnconnectedReservationForm);
