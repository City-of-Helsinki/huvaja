import React, { PropTypes } from 'react';
import RBCheckbox from 'react-bootstrap/lib/Checkbox';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

function Checkbox({ controlProps = {}, help, id, label, validationState }) {
  return (
    <FormGroup controlId={id} validationState={validationState}>
      <RBCheckbox {...controlProps}>
        {label}
      </RBCheckbox>
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

Checkbox.propTypes = {
  controlProps: PropTypes.object, // eslint-disable-line
  help: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  validationState: PropTypes.string,
};

export default Checkbox;
