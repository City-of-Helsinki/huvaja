import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import { Field, reduxForm } from 'redux-form';

import ReduxFormField from 'shared/form-fields/ReduxFormField';


const requiredFields = ['time', 'resource', 'eventName', 'numberOfParticipants'];

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
            'numberOfParticipants',
            'number',
            'Osallistujia',
          )}
          {props.error && (
            <div className="has-error">
              <HelpBlock>{props.error}</HelpBlock>
            </div>
          )}
          <div className="form-controls">
            <Button
              bsStyle="primary"
              type="submit"
            >
              Tallena varaus
            </Button>
            <Button
              bsStyle="default"
            >
              Peruuta
            </Button>
          </div>
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
