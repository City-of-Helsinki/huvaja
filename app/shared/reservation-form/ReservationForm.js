import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import { Field, reduxForm } from 'redux-form';
import forIn from 'lodash/forIn';

import ReduxFormField from 'shared/form-fields/ReduxFormField';


const requiredFields = {
  resource: true,
  eventName: true,
  participants: true,
};

export function validate(values) {
  const errors = {};
  forIn(requiredFields, (value, key) => {
    if (!values[key]) {
      errors[key] = 'Required';
    }
  });
  return errors;
}

function renderField(name, type, label, { controlProps, required }) {
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
      <Form className="reservation-form" onSubmit={handleSubmit}>
        {renderField(
          'resource',
          'text',
          'Tila',
          {
            controlProps: { disabled: true },
            required: requiredFields.resource !== null,
          }
        )}
        {renderField(
          'eventName',
          'text',
          'Tapahtuma',
          { required: requiredFields.eventName !== null }
        )}
        {renderField(
          'participants',
          'number',
          'Osallistujia',
          { required: requiredFields.participants !== null }
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
      </Form>
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
