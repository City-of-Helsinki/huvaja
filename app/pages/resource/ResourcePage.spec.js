import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import AvailabilityView from 'shared/availability-view';
import ResourceInfo from './info';
import ResourcePage from './ResourcePage';
import ReservationForm from './reservation-form';

function getWrapper(props) {
  const defaults = {
    date: '2016-01-01',
    onDateChange: () => null,
    resource: { id: 'ham' },
    unit: { name: { fi: 'Foobar' } },
  };
  return shallow(<ResourcePage {...defaults} {...props} />);
}

describe('pages/resource/ResourcePage', () => {
  it('renders ResourceInfo', () => {
    const resource = { id: 'id' };
    const unit = { name: { fi: 'unit' } };
    const info = getWrapper({ resource, unit }).find(ResourceInfo);
    expect(info).to.have.length(1);
    expect(info.prop('resource')).to.equal(resource);
    expect(info.prop('unit')).to.equal(unit);
  });

  it('renders AvailabilityView', () => {
    const date = '2016-10-10';
    const onDateChange = () => null;
    const resource = { id: 'foo-1' };
    const unit = { name: { fi: 'unit-3' } };
    const view = getWrapper({ date, resource, unit, onDateChange }).find(AvailabilityView);
    expect(view).to.have.length(1);
    expect(view.prop('groups')).to.deep.equal([
      { name: 'unit-3', resources: ['foo-1'] },
    ]);
    expect(view.prop('date')).to.equal(date);
    expect(view.prop('onDateChange')).to.equal(onDateChange);
  });

  it('renders ReservationForm', () => {
    const resource = { id: 'id' };
    const form = getWrapper({ resource }).find(ReservationForm);
    expect(form).to.have.length(1);
    expect(form.prop('resource')).to.equal(resource);
  });
});
