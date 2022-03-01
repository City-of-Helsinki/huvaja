import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import simple from 'simple-mock';

import { ReservationsRateReportModal } from './ReservationsRateReport';

describe('shared/modals/reservation-rate-report/ReservationsRateReport', () => {
  const defaults = {
    fetchReservationsRateReport: () => null,
    onHide: () => {},
    onChange: () => null,
    show: true,
    units: {
      abc: {
        name: { fi: 'Palaveri' },
        id: 'u-1',
      },
    },
    errorMessage: '',
    loading: false,
    filters: {
      dateStart: '2022-02-02',
      dateEnd: '2022-02-01',
      times: {
        begin: { time: '12:00' },
        end: { time: '13:00' },
      },
      unitSelections: [],
    },
  };

  function getWrapper(props) {
    return shallow(<ReservationsRateReportModal {...defaults} {...props} />);
  }

  it('passes props to Modal', () => {
    const instance = getWrapper().instance();
    expect(instance.props.onHide).to.equal(defaults.onHide);
    expect(instance.props.onChange).to.equal(defaults.onChange);
    expect(instance.props.fetchReservationsRateReport)
      .to.equal(defaults.fetchReservationsRateReport);
    expect(instance.props.show).to.equal(defaults.show);
    expect(instance.props.loading).to.equal(defaults.loading);
    expect(instance.props.units).to.eql(defaults.units);
    expect(instance.props.errorMessage).to.equal(defaults.errorMessage);
    expect(instance.props.filters).to.eql(defaults.filters);
  });

  describe('render', () => {
    it('modal', () => {
      expect(getWrapper().is(Modal)).to.be.true;
    });
    it('datepickers', () => {
      expect(getWrapper().find('.date-picker-field')).to.have.lengthOf(2);
    });
    it('timepicker', () => {
      expect(getWrapper().find('.reservation-time-range')).to.have.lengthOf(1);
    });
    it('unit selection', () => {
      expect(getWrapper().find('.unit-multi-select')).to.have.lengthOf(1);
    });
    it('download button', () => {
      expect(getWrapper().find('.download-button')).to.have.lengthOf(1);
    });
  });

  describe('fields have correct data', () => {
    it('unit selection has correct unit options', () => {
      const unitSelect = getWrapper().find('.unit-multi-select');
      expect(unitSelect.prop('options')).to.eql([{ value: 'u-1', label: 'Palaveri' }]);
    });
  });

  describe('onChange', () => {
    it('calls onChange with updated filter', () => {
      const onChange = simple.mock();
      const instance = getWrapper({ onChange }).instance();
      const filters = {
        dateStart: moment('2021-1-1'),
      };
      instance.handleChange(filters);
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.arg).to.deep.equal(filters);
    });
  });

  describe('report download', () => {
    it('calls fetchreservationreport on download button click', () => {
      const fetchReservationsRateReport = simple.mock();
      getWrapper({ fetchReservationsRateReport }).find('.download-button').simulate('click');
      expect(fetchReservationsRateReport.callCount).to.equal(1);
    });
  });
});
