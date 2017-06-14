import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';
import simple from 'simple-mock';

import ServingTimeField from './ServingTimeField';

describe('shared/reservation-form/catering/catering-form/ServingTimeField', () => {
  function getWrapper(props) {
    const defaults = {
      input: {
        value: '11:10',
        onChange: () => {},
      },
      controlProps: {
        step: 5,
      },
      type: 'time',
    };
    return shallow(<ServingTimeField {...defaults} {...props} />);
  }

  describe('serving at reservation time', () => {
    it('renders a radio input', () => {
      const input = getWrapper().find('#serving-reservation-time');
      expect(input).to.have.length(1);
      expect(input.type()).to.equal('input');
      expect(input.prop('type')).to.equal('radio');
    });

    it('input has disableCustomTime as onClick function', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const input = wrapper.find('#serving-reservation-time');
      expect(input.prop('onClick')).to.deep.equal(instance.disableCustomTime);
    });
  });

  describe('serving at custom time', () => {
    it('renders a radio input', () => {
      const input = getWrapper().find('#serving-custom-time');
      expect(input).to.have.length(1);
      expect(input.type()).to.equal('input');
      expect(input.prop('type')).to.equal('radio');
    });

    it('input has enableCustomTime as onClick function', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const input = wrapper.find('#serving-custom-time');
      expect(input.prop('onClick')).to.deep.equal(instance.enableCustomTime);
    });
  });

  it('sets enabledCustomTime state to true if input has value', () => {
    const instance = getWrapper().instance();
    expect(instance.state.enabledCustomTime).to.be.true;
  });

  it('sets enabledCustomTime state to false if input has no value', () => {
    const instance = getWrapper({ input: { value: '' } }).instance();
    expect(instance.state.enabledCustomTime).to.be.false;
  });

  it('enableCustomTime sets enableCustomTime to true', () => {
    const instance = getWrapper().instance();
    instance.setState({ enabledCustomTime: false });
    expect(instance.state.enabledCustomTime).to.be.false;
    instance.enableCustomTime();
    expect(instance.state.enabledCustomTime).to.be.true;
  });

  it('disableCustomTime sets enableCustomTime to false', () => {
    const instance = getWrapper().instance();
    instance.setState({ enabledCustomTime: true });
    expect(instance.state.enabledCustomTime).to.be.true;
    instance.disableCustomTime();
    expect(instance.state.enabledCustomTime).to.be.false;
  });

  it('disableCustomTime calls input onChange and passes an empty string', () => {
    const onChange = simple.mock();
    const instance = getWrapper({ input: { value: '11:11', onChange } }).instance();
    instance.disableCustomTime();
    expect(onChange.lastCall.args[0]).to.equal('');
  });

  describe('FormControl', () => {
    function getFormControlWrapper(props) {
      return getWrapper(props).find('.serving-time-form-control');
    }
    it('is a formControl', () => {
      expect(getFormControlWrapper().is(FormControl)).to.be.true;
    });

    it('has correct props', () => {
      const wrapper = getFormControlWrapper();
      expect(wrapper.prop('className')).to.equal('serving-time-form-control');
      expect(wrapper.prop('type')).to.equal('time');
    });

    it('gets props from input', () => {
      const formControl = getFormControlWrapper({ input: { foo: 'bar' } });
      expect(formControl.prop('foo')).to.equal('bar');
    });

    it('gets props from controlProps', () => {
      const formControl = getFormControlWrapper({ controlProps: { foo: 'bar' } });
      expect(formControl.prop('foo')).to.equal('bar');
    });

    it('gets disabled prop if disabled custom time', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      instance.setState({ enabledCustomTime: false });
      const formControl = wrapper.find('.serving-time-form-control');
      expect(formControl.prop('disabled')).to.be.true;
    });

    it('gets endabled prop if enabled custom time', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      instance.setState({ enabledCustomTime: true });
      const formControl = wrapper.find('.serving-time-form-control');
      expect(formControl.prop('disabled')).to.be.false;
    });
  });
});
