import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import simple from 'simple-mock';

import { ReservationDetailsReportButton } from './ReservationDetailsReportButton';

describe('shared/resource-daily-report-button/ReservationDetailsReportButton', () => {
  const defaultProps = {
    onClick: () => null,
    reservationId: 123,
  };

  function getWrapper(props) {
    return shallow(<ReservationDetailsReportButton {...defaultProps} {...props} />);
  }

  it('has class reservation-details-report-button', () => {
    expect(getWrapper().hasClass('reservation-details-report-button')).to.be.true;
  });

  it('renders a DropdownButton with correct title', () => {
    const button = getWrapper().find(DropdownButton);
    expect(button).to.have.length(1);
    expect(button.prop('title')).to.equal('Lataa raportti');
  });

  describe('full report item', () => {
    it('has correct text', () => {
      const item = getWrapper().find(MenuItem).at(0);
      expect(item.children().text()).to.equal('Täysi raportti');
    });

    it('calls onClick action with reservationId on click', () => {
      const onClick = simple.mock();
      const item = getWrapper({ onClick }).find(MenuItem).at(0);
      item.simulate('click');
      expect(onClick.callCount).to.equal(1);
      expect(onClick.lastCall.arg).to.deep.equal(defaultProps.reservationId);
    });
  });
});
