import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import Time from 'shared/form-fields/Time';
import ServingTimeField from './ServingTimeField';

describe('shared/reservation-form/catering/catering-form/ServingTimeField', () => {
  function getWrapper(props) {
    const defaults = {
      controlProps: {
        value: '11:10',
        onChange: () => {},
      },
      help: 'Some error.',
      label: 'Serving time',
    };
    return shallow(<ServingTimeField {...defaults} {...props} />);
  }

  it('has correct class', () => {
    expect(getWrapper().hasClass('serving-time-field')).to.be.true;
    expect(getWrapper().hasClass('has-error')).to.be.false;
  });

  it('has correct error class when validationState is error', () => {
    const props = { validationState: 'error' };
    expect(getWrapper(props).hasClass('has-error')).to.be.true;
  });

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

  it('sets enabledCustomTime state to true if controlProps has value', () => {
    const instance = getWrapper().instance();
    expect(instance.state.enabledCustomTime).to.be.true;
  });

  it('sets enabledCustomTime state to false if controlProps has no value', () => {
    const props = {
      controlProps: { onChange: () => null, value: '' },
    };
    const instance = getWrapper(props).instance();
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

  it('disableCustomTime calls onChange and passes an empty string', () => {
    const onChange = simple.mock();
    const props = { controlProps: { value: '11:11', onChange } };
    const instance = getWrapper(props).instance();
    instance.disableCustomTime();
    expect(onChange.lastCall.args[0]).to.equal('');
  });

  describe('Time', () => {
    function getTimeWrapper(props) {
      return getWrapper(props).find(Time);
    }

    it('gets props from controlProps', () => {
      const controlProps = { foo: 'bar', onChange: () => null };
      const time = getTimeWrapper({ controlProps });
      expect(time.prop('foo')).to.equal(controlProps.foo);
      expect(time.prop('onChange')).to.equal(controlProps.onChange);
    });

    it('gets disabled prop if disabled custom time', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      instance.setState({ enabledCustomTime: false });
      const time = wrapper.find(Time);
      expect(time.prop('disabled')).to.be.true;
    });

    it('gets endabled prop if enabled custom time', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      instance.setState({ enabledCustomTime: true });
      const time = wrapper.find(Time);
      expect(time.prop('disabled')).to.be.false;
    });
  });
});
