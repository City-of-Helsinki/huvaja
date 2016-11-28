import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';
import simple from 'simple-mock';

import DateSelector from './DateSelector';

function getWrapper(props) {
  const defaults = {
    value: moment().startOf('day'),
    onChange: () => null,
  };
  return shallow(<DateSelector {...defaults} {...props} />);
}

describe('shared/availability-view/DateSelector', () => {
  it('renders a div.date-selector', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.date-selector')).to.be.true;
  });

  it('renders link to previous day', () => {
    const wrapper = getWrapper();
    const link = wrapper.find('.previous');
    expect(link).to.have.length(1);
    expect(link.prop('onClick')).to.equal(wrapper.instance().handlePreviousClick);
  });

  it('renders link to next day', () => {
    const wrapper = getWrapper();
    const link = wrapper.find('.next');
    expect(link).to.have.length(1);
    expect(link.prop('onClick')).to.equal(wrapper.instance().handleNextClick);
  });

  it('renders current value', () => {
    const value = moment();
    const date = getWrapper({ value }).find('.current-value');
    expect(date).to.have.length(1);
    expect(date.text()).to.equal(value.format('dd D.M.YYYY'));
  });

  describe('handleNextClick', () => {
    it('calls onChange with next date', () => {
      const value = moment('2016-01-01');
      const onChange = simple.mock();
      const wrapper = getWrapper({ value, onChange });
      wrapper.instance().handleNextClick();
      expect(onChange.callCount).to.equal(1);
      const args = onChange.lastCall.args;
      expect(args).to.have.length(1);
      expect(args[0]).to.equal('2016-01-02');
    });
  });

  describe('handlePreviousClick', () => {
    it('calls onChange with previous date', () => {
      const value = moment('2016-01-01');
      const onChange = simple.mock();
      const wrapper = getWrapper({ value, onChange });
      wrapper.instance().handlePreviousClick();
      expect(onChange.callCount).to.equal(1);
      const args = onChange.lastCall.args;
      expect(args).to.have.length(1);
      expect(args[0]).to.equal('2015-12-31');
    });
  });
});
