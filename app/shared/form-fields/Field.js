import React, { PropTypes } from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

Field.propTypes = {
  componentClass: PropTypes.func.isRequired,
  controlProps: PropTypes.object,
  help: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  validationState: PropTypes.string,
};
export default function Field(props) {
  return (
    <FormGroup controlId={props.id} validationState={props.validationState}>
      <ControlLabel>{props.label}</ControlLabel>
      <FormControl componentClass={props.componentClass} {...props.controlProps} />
      {props.help && <HelpBlock>{props.help}</HelpBlock>}
    </FormGroup>
  );
}
