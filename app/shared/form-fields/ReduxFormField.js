import React, { PropTypes } from 'react';

import Checkbox from './Checkbox';
import DateTimeRange from './DateTimeRange';
import FormControl from './FormControl';
import ReservationTime from './reservation-time';

function ReduxFormField({ controlProps = {}, help, input, label, meta, type }) {
  const showError = meta.error && meta.touched;
  const props = {
    controlProps: Object.assign({}, input, controlProps),
    help: showError ? meta.error : help,
    id: input.name,
    label,
    type,
    validationState: showError ? 'error' : undefined,
  };

  if (type === 'checkbox') {
    return <Checkbox {...props} />;
  }
  if (type === 'date-time-range') {
    return <DateTimeRange {...props} />;
  }
  if (type === 'reservation-time') {
    return <ReservationTime {...props} />;
  }

  return <FormControl {...props} />;
}

ReduxFormField.propTypes = {
  controlProps: PropTypes.object,
  help: PropTypes.string,
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};

export default ReduxFormField;
