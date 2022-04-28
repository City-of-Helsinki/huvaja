import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import selector from './ReservationsRateReportSelector';

describe('shared/modals/reservation-rate-report/ReservationsRateReportSelector', () => {
  const units = {
    'u-1': { id: 'u-1', name: { fi: 'Unit 1' } },
    'u-2': { id: 'u-2', name: { fi: 'Unit 2' } },
  };

  describe('show', () => {
    it('returns true if ReservationsRateReport modal show is true', () => {
      const state = getState({
        'modals.reservationsRateReport': { show: true },
      });
      const actual = selector(state).show;
      expect(actual).to.be.true;
    });

    it('returns false if ReservationsRateReport modal show is false', () => {
      const state = getState({
        'modals.reservationsRateReport': { show: false },
      });
      const actual = selector(state).show;
      expect(actual).to.be.false;
    });
  });

  describe('units', () => {
    it('returns units', () => {
      const state = getState({
        'data.units': units,
      });
      const actual = selector(state).units;
      expect(actual).to.eql(state.data.units);
    });
  });
});
