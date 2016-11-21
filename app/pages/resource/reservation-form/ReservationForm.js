import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Field, reduxForm } from 'redux-form';

import ReduxFormField from 'shared/form-fields/ReduxFormField';


const requiredFields = ['resource', 'eventName', 'numberOfParticipants'];

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

export function UnconnectedReservationForm({ handleSubmit }) {
  return (
    <div>
      <form className="reservation-form" onSubmit={handleSubmit}>
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
      </form>
    </div>
  );
}

UnconnectedReservationForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'resourceReservation',
  validate,
})(UnconnectedReservationForm);
