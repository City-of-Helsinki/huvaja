import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { browserHistory } from 'react-router';
import simple from 'simple-mock';

import SelectableSingleAvailabilityView from 'shared/form-fields/reservation-time/SelectableSingleAvailabilityView';
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

  it('renders SelectableSingleAvailabilityView', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    const form = wrapper.find(SelectableSingleAvailabilityView);
    expect(form).to.have.length(1);
    expect(form.prop('date')).to.equal(defaults.date);
    expect(form.prop('resource')).to.equal(defaults.resource);
    expect(form.prop('onChange')).to.equal(instance.onValueChange);
    expect(form.prop('onDateChange')).to.equal(defaults.onDateChange);
    expect(form.prop('onDateSelection')).to.equal(instance.goToCreateReservation);
    expect(form.prop('value')).to.equal(instance.state.timelineSelectionValue);
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

  it('sets initial timelineSelectionValue on state', () => {
    expect(getWrapper().instance().state.timelineSelectionValue).to.deep.equal({
      begin: {
        date: defaults.date,
        time: '',
      },
      end: {
        date: defaults.date,
        time: '',
      },
    });
  });

  it('sets new timelineSelectionValue to state onValueChange', () => {
    const instance = getWrapper().instance();
    const expected = {
      begin: {
        date: '2017-02-02',
        time: '10:00',
      },
      end: {
        date: '2017-02-02',
        time: '12:00',
      },
    };
    instance.onValueChange(expected);
    expect(instance.state.timelineSelectionValue).to.deep.equal(expected);
  });

  describe('goToCreateReservation', () => {
    before(() => {
      simple.mock(browserHistory, 'push');
    });

    after(() => {
      simple.restore();
    });

    it('goToCreateReservation redirects to create reservation page', () => {
      const instance = getWrapper().instance();
      const timelineSelectionValue = {
        begin: {
          date: '2017-02-02',
          time: '10:00',
        },
        end: {
          date: '2017-02-02',
          time: '12:00',
        },
      };
      instance.setState({ timelineSelectionValue });
      instance.goToCreateReservation();
      expect(browserHistory.push.lastCall.args[0]).to.deep.equal(
        '/reservations/create?begin=2017-02-02T10%3A00%3A00.000&end=2017-02-02T12%3A00%3A00.000&resource=ham'
      );
    });
  });
});
