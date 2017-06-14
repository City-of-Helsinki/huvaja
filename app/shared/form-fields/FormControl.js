import React, { PropTypes } from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import RBFormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

function FormControl({ className, controlProps = {}, help, id, label, type, validationState }) {
  return (
    <FormGroup className={className} controlId={id} validationState={validationState}>
      <ControlLabel>
        {label}
      </ControlLabel>
      <RBFormControl
        {...controlProps}
        componentClass={type === 'textarea' ? 'textarea' : undefined}
        type={type !== 'textarea' ? type : undefined}
      />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

FormControl.propTypes = {
  className: PropTypes.string,
  controlProps: PropTypes.object,
  help: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  validationState: PropTypes.string,
};

export default FormControl;
