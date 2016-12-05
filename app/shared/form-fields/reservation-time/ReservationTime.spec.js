import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import ReservationTime from './ReservationTime';
import SelectableSingleAvailabilityView from './SelectableSingleAvailabilityView';

function getWrapper(props) {
  const defaults = {
    id: 'reservation-time',
    controlProps: {
      date: '2016-01-01',
      value: undefined,
      resource: { id: 'r1' },
      onChange: () => null,
      onDateChange: () => null,
    },
  };
  return shallow(<ReservationTime {...defaults} {...props} />);
}

describe('shared/form-fields/reservation-time/ReservationTime', () => {
  it('renders a SelectableSingleAvailabilityView', () => {
    const controlProps = {
      date: '2016-01-02',
      value: {},
      resource: { id: 'r1' },
      onChange: () => null,
      onDateChange: () => null,
    };
    const wrapper = getWrapper({ controlProps });
    const view = wrapper.find(SelectableSingleAvailabilityView);
    expect(view).to.have.length(1);
    expect(view.prop('date')).to.equal(controlProps.date);
    expect(view.prop('value')).to.equal(controlProps.value);
    expect(view.prop('resource')).to.equal(controlProps.resource);
    expect(view.prop('onChange')).to.equal(controlProps.onChange);
    expect(view.prop('onDateChange')).to.equal(controlProps.onDateChange);
  });
});
