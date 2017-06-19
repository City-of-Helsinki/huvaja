import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import CateringSection from 'shared/reservation-form/catering';
import ServingTimeField from 'shared/reservation-form/catering/catering-form/ServingTimeField';
import Checkbox from './Checkbox';
import FormControl from './FormControl';
import ReduxFormField from './ReduxFormField';
import ReservationTime from './reservation-time';
import ResourceField from './resource-field';

describe('shared/form-fields/ReduxFormField', () => {
  const defaultProps = {
    controlProps: { onChange: () => null, someProp: 'some' },
    input: { name: 'email' },
    label: 'Enter your email',
    meta: { error: 'some error' },
    name: 'email',
    type: 'text',
  };

  function getWrapper(props) {
    return shallow(<ReduxFormField {...defaultProps} {...props} />);
  }

  describe('if type is "cateringOrder"', () => {
    it('renders a CateringSection component', () => {
      const wrapper = getWrapper({ type: 'cateringOrder' });
      const checkbox = wrapper.find(CateringSection);
      expect(checkbox.length).to.equal(1);
    });
  });

  describe('if type is "checkbox"', () => {
    it('renders a Checkbox component', () => {
      const wrapper = getWrapper({ type: 'checkbox' });
      const checkbox = wrapper.find(Checkbox);
      expect(checkbox.length).to.equal(1);
    });
  });

  describe('if type is "reservation-time"', () => {
    it('renders a ReservationTime component', () => {
      const wrapper = getWrapper({ type: 'reservation-time' });
      const time = wrapper.find(ReservationTime);
      expect(time).to.have.length(1);
    });
  });

  describe('if type is "resource"', () => {
    it('renders a ResourceField component', () => {
      const wrapper = getWrapper({ type: 'resource' });
      const time = wrapper.find(ResourceField);
      expect(time).to.have.length(1);
    });
  });

  describe('if type is "servingTime"', () => {
    it('renders a ServingTimeField component', () => {
      const wrapper = getWrapper({ type: 'servingTime' });
      const time = wrapper.find(ServingTimeField);
      expect(time).to.have.length(1);
    });
  });

  describe('if type is anything else', () => {
    it('renders a FormControl component', () => {
      const wrapper = getWrapper({ type: 'text' });
      const formControl = wrapper.find(FormControl);
      expect(formControl.length).to.equal(1);
    });
  });

  describe('passing props', () => {
    it('controlProps contain both props.input and props.controlProps', () => {
      const actualProps = getWrapper().find(FormControl).props();
      const expected = Object.assign({}, defaultProps.input, defaultProps.controlProps);
      expect(actualProps.controlProps).to.deep.equal(expected);
    });

    describe('help', () => {
      const help = 'some help text';

      describe('if field contains an error', () => {
        const error = 'some error';

        describe('if field has been touched', () => {
          const touched = true;
          const meta = { error, touched };

          it('is the erorr message', () => {
            const props = { meta, help };
            const actualProps = getWrapper(props).find(FormControl).props();
            expect(actualProps.help).to.equal(error);
          });
        });

        describe('if field has not been touched', () => {
          const touched = false;
          const meta = { error, touched };

          it('is the help text given in props', () => {
            const props = { meta, help };
            const actualProps = getWrapper(props).find(FormControl).props();
            expect(actualProps.help).to.equal(help);
          });
        });
      });

      describe('if field does not contain an error', () => {
        const error = undefined;
        const meta = { error };

        it('is the help text given in props', () => {
          const props = { meta, help };
          const actualProps = getWrapper(props).find(FormControl).props();
          expect(actualProps.help).to.equal(help);
        });
      });
    });

    it('id is the name', () => {
      const actualProps = getWrapper().find(FormControl).props();
      expect(actualProps.id).to.equal(defaultProps.name);
    });

    it('label is the label given in props', () => {
      const actualProps = getWrapper().find(FormControl).props();
      expect(actualProps.label).to.equal(defaultProps.label);
    });

    it('type is the type given in props', () => {
      const actualProps = getWrapper().find(FormControl).props();
      expect(actualProps.type).to.equal(defaultProps.type);
    });

    describe('validationState', () => {
      describe('if field contains an error', () => {
        const error = 'some error';

        describe('if field has been touched', () => {
          const touched = true;
          const meta = { error, touched };

          it('is "error"', () => {
            const props = { meta };
            const actualProps = getWrapper(props).find(FormControl).props();
            expect(actualProps.validationState).to.equal('error');
          });
        });

        describe('if field has not been touched', () => {
          const touched = false;
          const meta = { error, touched };

          it('is undefined', () => {
            const props = { meta };
            const actualProps = getWrapper(props).find(FormControl).props();
            expect(actualProps.validationState).to.equal(undefined);
          });
        });
      });

      describe('if field does not contain an error', () => {
        const error = undefined;
        const meta = { error };

        it('is undefined', () => {
          const props = { meta };
          const actualProps = getWrapper(props).find(FormControl).props();
          expect(actualProps.validationState).to.equal(undefined);
        });
      });
    });
  });
});
