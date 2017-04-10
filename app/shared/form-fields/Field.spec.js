import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

import Field from './Field';

describe('shared/form-fields/Field', () => {
  const defaultProps = {
    componentClass: () => <div />,
    controlProps: { someProp: 'some', otherProp: 'other' },
    id: 'startTime',
    label: 'Start time',
    validationState: 'error',
  };

  function getWrapper(props) {
    return shallow(<Field {...defaultProps} {...props} />);
  }

  describe('FormGroup component', () => {
    it('is rendered', () => {
      const formGroup = getWrapper().find(FormGroup);
      expect(formGroup.length).to.equal(1);
    });

    it('gets correct props', () => {
      const actualProps = getWrapper().find(FormGroup).props();
      expect(actualProps.controlId).to.equal(defaultProps.id);
      expect(actualProps.validationState).to.equal(defaultProps.validationState);
    });
  });

  describe('FormControl component', () => {
    it('is rendered', () => {
      const control = getWrapper().find(FormControl);
      expect(control.length).to.equal(1);
    });

    it('gets correct props', () => {
      const actualProps = getWrapper().find(FormControl).props();
      Object.keys(defaultProps.controlProps).forEach((key) => {
        expect(actualProps[key]).to.equal(defaultProps.controlProps[key]);
      });
    });

    it('gets componentClass as the componentClass', () => {
      function SomeComponent() { return <div />; }
      const control = getWrapper({ componentClass: SomeComponent }).find(FormControl);
      expect(control.prop('componentClass')).to.equal(SomeComponent);
    });
  });

  describe('HelpBlock component', () => {
    describe('if help is given in props', () => {
      const help = 'some help';

      it('is rendered', () => {
        const helpBlock = getWrapper({ help }).find(HelpBlock);
        expect(helpBlock.length).to.equal(1);
      });

      it('displays the help text given in props', () => {
        const helpBlock = getWrapper({ help }).find(HelpBlock);
        expect(helpBlock.props().children).to.equal(help);
      });
    });

    describe('if help is not given in props', () => {
      const help = undefined;

      it('is not rendered', () => {
        const helpBlock = getWrapper({ help }).find(HelpBlock);
        expect(helpBlock.length).to.equal(0);
      });
    });
  });
});
