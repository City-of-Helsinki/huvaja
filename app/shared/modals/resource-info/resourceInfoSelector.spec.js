import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import selector from './resourceInfoSelector';

describe('shared/modals/reservation-info/reservationInfoSelector', () => {
  const resource = {
    id: 'r-1',
    unit: 'u-1',
  };
  const unit = {
    id: 'u-1',
  };

  function getSelected(extraState) {
    const state = getState({
      'data.resources': {
        'r-1': resource,
      },
      'data.units': {
        'u-1': unit,
      },
      'modals.resourceInfo': {
        resourceId: 'r-1',
        show: true,
      },
      ...extraState,
    });
    return selector(state);
  }

  describe('resource', () => {
    it('returns resource', () => {
      const actual = getSelected().resource;
      expect(actual).to.deep.equal(resource);
    });

    it('returns undefined if id not found', () => {
      const extraState = { 'data.resources': {} };
      const actual = getSelected(extraState).resource;
      expect(actual).to.be.undefined;
    });
  });

  describe('show', () => {
    it('returns true if resourceInfo modal show is true', () => {
      const actual = getSelected().show;
      expect(actual).to.be.true;
    });

    it('returns false if resourceInfo modal show is false', () => {
      const extraState = {
        'modals.resourceInfo': { show: false },
      };
      const actual = getSelected(extraState).show;
      expect(actual).to.be.false;
    });
  });

  describe('unit', () => {
    it('returns unit', () => {
      const actual = getSelected().unit;
      expect(actual).to.deep.equal(unit);
    });

    it('returns undefined if unit not found', () => {
      const extraState = { 'data.units': {} };
      const actual = getSelected(extraState).unit;
      expect(actual).to.be.undefined;
    });
  });
});
