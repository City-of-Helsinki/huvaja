import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import simple from 'simple-mock';

import { ResourceDailyReportButton } from './ResourceDailyReportButton';

describe('shared/resource-daily-report-button/ResourceDailyReportButton', () => {
  const defaultProps = {
    date: '2016-12-12',
    onClick: () => null,
    resourceIds: ['1', '2', '3'],
  };

  function getWrapper(props) {
    return shallow(<ResourceDailyReportButton {...defaultProps} {...props} />);
  }

  it('is a button', () => {
    expect(getWrapper().is(Button)).to.be.true;
  });

  it('has class resource-daily-report-button', () => {
    expect(getWrapper().hasClass('resource-daily-report-button')).to.be.true;
  });

  it('renders correct text', () => {
    expect(getWrapper().children().text()).to.equal('Lataa päiväraportti');
  });

  it('calls fetchResourceDailyReport action on click', () => {
    const onClick = simple.mock();
    getWrapper({ onClick }).simulate('click');
    expect(onClick.callCount).to.equal(1);
    expect(onClick.lastCall.arg).to.deep.equal({
      date: defaultProps.date,
      resourceIds: defaultProps.resourceIds,
    });
  });
});
