import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import { Field, reduxForm } from 'redux-form';

import ReduxFormField from 'shared/form-fields/ReduxFormField';

export function validate() { return {}; }

function renderField(name, type, label) {
  return (
    <Field
      component={ReduxFormField}
      label={`${label}*`}
      name={name}
      type={type}
    />
  );
}

function UnconnectedReservationForm({ handleSubmit, onClose, onConfirm }) {
  return (
    <div>
      <Form className="reservation-form">
        {renderField('resource', 'text', 'Tila')}
        {renderField('eventName', 'text', 'Tapahtuma')}
        {renderField('participants', 'number', 'Osallistujia')}
        <div className="form-controls">
          <Button
            bsStyle="primary"
            onClick={handleSubmit(onConfirm)}
            type="submit"
          >
            Tallena varaus
          </Button>
          <Button
            bsStyle="default"
            onClick={onClose}
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
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'resourceReservation',
  validate,
})(UnconnectedReservationForm);
