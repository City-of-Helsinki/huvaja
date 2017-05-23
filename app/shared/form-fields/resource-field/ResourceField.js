import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import InputGroup from 'react-bootstrap/lib/InputGroup';

import ResourceInfoButton from 'shared/resource-info-button';
import ResourceSelectorModal from 'shared/modals/resource-selector';

ResourceField.propTypes = {
  id: PropTypes.string.isRequired,
  controlProps: PropTypes.object,
  help: PropTypes.string,
  hideSelector: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  showSelector: PropTypes.func.isRequired,
  validationState: PropTypes.string,
};
export default function ResourceField({
  id,
  controlProps,
  help,
  hideSelector,
  label,
  showSelector,
  validationState,
}) {
  const onSelect = (resourceId) => {
    controlProps.onChange(resourceId);
    hideSelector();
  };
  const resourceName = (
    controlProps.resource ?
    controlProps.resource.name.fi :
    ''
  );
  return (
    <div className="resource-field">
      <FormGroup
        controlId={id}
        onClick={showSelector}
        validationState={validationState}
      >
        <ControlLabel>
          {label}
        </ControlLabel>
        <InputGroup>
          <FormControl readOnly type="text" value={resourceName} />
          <InputGroup.Button>
            <Button>
              {controlProps.resource
                ? 'Vaihda tila'
                : 'Valitse tila'}
            </Button>
          </InputGroup.Button>
        </InputGroup>
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>
      {controlProps.resource &&
        <ResourceInfoButton resourceId={controlProps.resource.id} />
      }
      <ResourceSelectorModal
        onSelect={onSelect}
        selectedResource={controlProps.resource}
        selectedTimeRange={controlProps.timeRange}
      />
    </div>
  );
}
