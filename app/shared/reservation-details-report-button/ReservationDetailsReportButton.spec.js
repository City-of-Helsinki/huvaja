import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
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

  it('is a button', () => {
    expect(getWrapper().is(Button)).to.be.true;
  });

  it('has class reservation-details-report-button', () => {
    expect(getWrapper().hasClass('reservation-details-report-button')).to.be.true;
  });

  it('renders correct text', () => {
    expect(getWrapper().children().text()).to.equal('Lataa raportti');
  });

  it('calls onClick action with correct props on click', () => {
    const onClick = simple.mock();
    getWrapper({ onClick }).simulate('click');
    expect(onClick.callCount).to.equal(1);
    expect(onClick.lastCall.arg).to.deep.equal(defaultProps.reservationId);
  });
});
