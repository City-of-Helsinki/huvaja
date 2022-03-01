import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import simple from 'simple-mock';

import { ReservationsReportButton } from './ReservationsReportButton';

describe('shared/reservation-report-button/ReservationsReportButton', () => {
  const defaultProps = {
    onClick: () => null,
    showReservationsRateReportModal: () => null,
    searchFilters: {
      start: '2017-11-29',
      end: '2017-11-30',
    },
  };

  function getWrapper(props) {
    return shallow(<ReservationsReportButton {...defaultProps} {...props} />);
  }

  it('has class reservations-report-button', () => {
    expect(getWrapper().hasClass('reservations-report-button')).to.be.true;
  });

  it('renders a DropdownButton with correct title', () => {
    const button = getWrapper().find(DropdownButton);
    expect(button).to.have.length(1);
    expect(button.prop('title')).to.equal('Lataa raportti');
  });

  describe('report items', () => {
    it('has correct text', () => {
      const item1 = getWrapper().find(MenuItem).at(0);
      const item2 = getWrapper().find(MenuItem).at(1);
      expect(item1.children().text()).to.equal('Varausraportti');
      expect(item2.children().text()).to.equal('Varausasteraportti');
    });

    it('calls onClick action on click', () => {
      const onClick = simple.mock();
      const item = getWrapper({ onClick }).find(MenuItem).at(0);
      item.simulate('click');
      expect(onClick.callCount).to.equal(1);
      expect(onClick.lastCall.arg).to.deep.equal(defaultProps.searchFilters);
    });
    it('calls showReservationsRateReportModal action on click', () => {
      const showReservationsRateReportModal = simple.mock();
      const item = getWrapper({ showReservationsRateReportModal }).find(MenuItem).at(1);
      item.simulate('click');
      expect(showReservationsRateReportModal.callCount).to.equal(1);
    });
  });
});
