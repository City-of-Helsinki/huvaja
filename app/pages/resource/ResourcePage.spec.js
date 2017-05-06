import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import SingleAvailabilityView from 'shared/availability-view/SingleAvailabilityView';
import ResourceDailyReportButton from 'shared/resource-daily-report-button';
import ResourceInfo from './info';
import ResourcePage from './ResourcePage';

describe('pages/resource/ResourcePage', () => {
  const defaults = {
    date: '2016-01-01',
    hideResourceImages: () => null,
    onDateChange: () => null,
    resource: { id: 'ham' },
    resourceSearchUrl: '/?search=room',
    showResourceImages: () => null,
    unit: { name: { fi: 'Foobar' } },
  };

  function getWrapper(props) {
    return shallow(<ResourcePage {...defaults} {...props} />);
  }

  it('renders ResourceInfo', () => {
    const info = getWrapper().find(ResourceInfo);
    expect(info).to.have.length(1);
    expect(info.prop('resource')).to.equal(defaults.resource);
    expect(info.prop('unit')).to.equal(defaults.unit);
    expect(info.prop('hideResourceImages')).to.equal(defaults.hideResourceImages);
    expect(info.prop('showResourceImages')).to.equal(defaults.showResourceImages);
    expect(info.prop('resourceSearchUrl')).to.equal(defaults.resourceSearchUrl);
  });

  it('renders SingleAvailabilityView', () => {
    const form = getWrapper().find(SingleAvailabilityView);
    expect(form).to.have.length(1);
    expect(form.prop('date')).to.equal(defaults.date);
    expect(form.prop('resource')).to.equal(defaults.resource.id);
    expect(form.prop('onDateChange')).to.equal(defaults.onDateChange);
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
