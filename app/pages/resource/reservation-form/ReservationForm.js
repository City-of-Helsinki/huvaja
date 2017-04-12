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

export function validate(values) {
  const errors = {};
  requiredFields.forEach((value) => {
    if (!values[value]) {
      errors[value] = 'Pakollinen tieto';
    }
  });
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
