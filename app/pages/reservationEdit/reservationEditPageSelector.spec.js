import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import reservationEditPageSelector from './reservationEditPageSelector';

describe('pages/search/reservationEditPageSelector', () => {
  const resources = {
    'r-1': { id: 'r-1' },
    'r-2': { id: 'r-2' },
  };
  const reservations = {
    1: { id: 1, resource: 'r-1' },
    2: { id: 2, resource: 'r-2' },
  };

  function getSelected() {
    const state = getState({
      'data.reservations': reservations,
      'data.resources': resources,
    });
    const props = {
      params: { id: '2' },
    };
    return reservationEditPageSelector(state, props);
  }

  it('returns reservation', () => {
    expect(getSelected().reservation).to.deep.equal(reservations[2]);
  });

  it('returns resource', () => {
    expect(getSelected().resource).to.deep.equal(resources['r-2']);
  });
});
