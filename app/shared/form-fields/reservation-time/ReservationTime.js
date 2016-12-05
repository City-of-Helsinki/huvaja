import React, { PropTypes } from 'react';
import FormGroup from 'react-bootstrap/lib/FormGroup';

import SelectableSingleAvailabilityView from './SelectableSingleAvailabilityView';

ReservationTime.propTypes = {
  id: PropTypes.string.isRequired,
  controlProps: PropTypes.object.isRequired,
  help: PropTypes.string,
  validationState: PropTypes.string,
};
export default function ReservationTime(props) {
  return (
    <FormGroup controlId={props.id} validationState={props.validationState}>
      <SelectableSingleAvailabilityView help={props.help} {...props.controlProps} />
    </FormGroup>
  );
}
