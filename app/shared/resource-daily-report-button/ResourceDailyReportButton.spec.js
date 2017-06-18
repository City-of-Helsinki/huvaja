import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
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

  it('has class resource-daily-report-button', () => {
    expect(getWrapper().hasClass('resource-daily-report-button')).to.be.true;
  });

  it('renders a DropdownButton with correct title', () => {
    const button = getWrapper().find(DropdownButton);
    expect(button).to.have.length(1);
    expect(button.prop('title')).to.equal('Lataa raportti');
  });

  describe('daily report item', () => {
    it('has correct text', () => {
      const item = getWrapper().find(MenuItem).at(0);
      expect(item.children().text()).to.equal('Päiväraportti');
    });

    it('calls onClick action on click', () => {
      const onClick = simple.mock();
      const item = getWrapper({ onClick }).find(MenuItem).at(0);
      item.simulate('click');
      expect(onClick.callCount).to.equal(1);
      expect(onClick.lastCall.arg).to.deep.equal({
        date: defaultProps.date,
        resourceIds: defaultProps.resourceIds,
      });
    });
  });
});
