import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';

import ResourceDailyReportButton from './ResourceDailyReportButton';

describe('shared/resource-daily-report-button/ResourceDailyReportButton', () => {
  const defaultProps = {
    resourceIds: ['1', '2', '3'],
    date: '2016-12-12',
  };

  function getWrapper(props) {
    return shallow(<ResourceDailyReportButton {...defaultProps} {...props} />);
  }

  it('is a button', () => {
    expect(getWrapper().is(Button)).to.be.true;
  });

  it('has resource-daily-report-button class name', () => {
    expect(getWrapper().prop('className')).to.equal('resource-daily-report-button');
  });

  it('renders correct text', () => {
    expect(getWrapper().children().text()).to.equal('Lataa päiväraportti');
  });

  describe('href', () => {
    it('points to correct endpoint', () => {
      expect(getWrapper().prop('href')).to.equal(
        `${SETTINGS.API_URL}reports/daily_reservations/?day=2016-12-12&resource=1%2C2%2C3`
      );
    });
  });
});
