import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';
import MaskedInput from 'react-maskedinput';
import simple from 'simple-mock';

import Time from './Time';

function getWrapper(props) {
  const defaults = {
    onChange: () => null,
    value: '10:30',
  };
  return shallow(<Time {...defaults} {...props} />);
}

describe('shared/form-fields/Time', () => {
  it('renders a FormControl', () => {
    const wrapper = getWrapper();
    expect(wrapper.is(FormControl)).to.be.true;
    const props = wrapper.props();
    expect(props.className).to.equal('time-field');
    expect(props.componentClass).to.equal(MaskedInput);
    expect(props.mask).to.equal('11:11');
    expect(props.disabled).to.be.false;
  });

  it('can be disabled', () => {
    const wrapper = getWrapper({ disabled: true });
    expect(wrapper.prop('disabled')).to.be.true;
  });

  describe('handleChange', () => {
    it('calls props.onChange', () => {
      const onChange = simple.mock();
      const instance = getWrapper({ onChange }).instance();
      instance.handleChange({ target: { value: '12:00' } });
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args).to.deep.equal(['12:00']);
    });
  });
});
