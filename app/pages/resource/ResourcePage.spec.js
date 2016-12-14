import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import ResourceDailyReportButton from 'shared/resource-daily-report-button';
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

  it('renders ReservationForm', () => {
    const resource = { id: 'id' };
    const form = getWrapper({ resource }).find(ReservationForm);
    expect(form).to.have.length(1);
    expect(form.prop('resource')).to.equal(resource);
  });

  it('renders ResourceDailyReportButton', () => {
    const props = {
      resource: { id: 'id' },
      date: '2016-01-01',
    };
    const reportButtonWrapper = getWrapper(props).find(ResourceDailyReportButton);
    expect(reportButtonWrapper).to.have.length(1);
    expect(reportButtonWrapper.prop('date')).to.equal('2016-01-01');
    expect(reportButtonWrapper.prop('resourceIds')).to.deep.equal(['id']);
  });
});
