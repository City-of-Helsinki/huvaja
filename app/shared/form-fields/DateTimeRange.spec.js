import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import DatePicker from 'shared/date-picker';
import DateTimeRange from './DateTimeRange';
import Field from './Field';
import Time from './Time';

function getWrapper(props) {
  const defaults = {
    controlProps: {
      onChange: () => null,
      value: { begin: {}, end: {} },
    },
    id: '1234',
    noLabels: false,
  };
  return shallow(<DateTimeRange {...defaults} {...props} />);
}

describe('shared/form-fields/DateTimeRange', () => {
  it('renders a div.date-time-range-field', () => {
    const wrapper = getWrapper().find('div.date-time-range-field');
    expect(wrapper).to.have.length(1);
  });

  it('renders a div.date-time-range-field-container', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.date-time-range-field-container')).to.be.true;
  });

  it('renders correct fields', () => {
    const fields = getWrapper().find(Field);
    expect(fields).to.have.length(3);
    expect(fields.at(0).prop('componentClass')).to.equal(DatePicker);
    expect(fields.at(1).prop('componentClass')).to.equal(Time);
    expect(fields.at(2).prop('componentClass')).to.equal(Time);
  });

  it('renders labels only when noLabels = false', () => {
    const fields = getWrapper().find(Field);
    expect(fields.at(0).prop('label')).to.equal('Päivä');
    expect(fields.at(1).prop('label')).to.equal('Alkaa');
    expect(fields.at(2).prop('label')).to.equal('Päättyy');

    const fieldsWithoutLabels = getWrapper({ noLabels: true }).find(Field);
    expect(fieldsWithoutLabels.at(0).prop('label')).to.equal('');
    expect(fieldsWithoutLabels.at(1).prop('label')).to.equal('');
    expect(fieldsWithoutLabels.at(2).prop('label')).to.equal('');
  });

  describe('handleDateChange', () => {
    it('updates begin.date and end.date', () => {
      const date = 'date2';
      const onChange = simple.mock();
      const value = {
        begin: { date: 'date1', time: 'time1' },
        end: { date: 'date1', time: 'time2' },
      };
      const wrapper = getWrapper({ controlProps: { onChange, value } });
      wrapper.instance().handleDateChange(date);
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args).to.deep.equal([{
        begin: { date, time: 'time1' },
        end: { date, time: 'time2' },
      }]);
    });
  });

  describe('handleStartTimeChange', () => {
    it('updates begin.time', () => {
      const time = 'new-start-time';
      const onChange = simple.mock();
      const value = {
        begin: { date: 'date1', time: 'time1' },
        end: { date: 'date1', time: 'time2' },
      };
      const wrapper = getWrapper({ controlProps: { onChange, value } });
      wrapper.instance().handleStartTimeChange(time);
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args).to.deep.equal([{
        begin: { date: 'date1', time },
        end: { date: 'date1', time: 'time2' },
      }]);
    });
  });

  describe('handleEndTimeChange', () => {
    it('updates end.time', () => {
      const time = 'new-start-time';
      const onChange = simple.mock();
      const value = {
        begin: { date: 'date1', time: 'time1' },
        end: { date: 'date1', time: 'time2' },
      };
      const wrapper = getWrapper({ controlProps: { onChange, value } });
      wrapper.instance().handleEndTimeChange(time);
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args).to.deep.equal([{
        begin: { date: 'date1', time: 'time1' },
        end: { date: 'date1', time },
      }]);
    });
  });

  describe('handleBlur', () => {
    it('works if no props.controlProps.onBlur', () => {
      const onChange = simple.mock();
      const value = {
        begin: { date: 'date1', time: 'time1' },
        end: { date: 'date1', time: 'time2' },
      };
      const wrapper = getWrapper({ controlProps: { onChange, value, onBlur: null } });
      wrapper.instance().handleBlur();
    });

    it('calls props.controlProps.onBlur', () => {
      const onBlur = simple.mock();
      const onChange = simple.mock();
      const value = {
        begin: { date: 'date1', time: 'time1' },
        end: { date: 'date1', time: 'time2' },
      };
      const wrapper = getWrapper({ controlProps: { onChange, value, onBlur } });
      wrapper.instance().handleBlur();
      expect(onBlur.callCount).to.equal(1);
      expect(onBlur.lastCall.args).to.deep.equal([value]);
    });
  });
});
