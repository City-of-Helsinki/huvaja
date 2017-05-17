import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import reservationEditPageSelector from './ReservationEditPageSelector';

describe('pages/search/ReservationEditPageSelector', () => {
  const resources = {
    'r-2': { id: 'r-2' },
    'r-3': { id: 'r-3' },
  };
  const reservations = {
    1: { id: 1, resource: 'r-1' },
    2: { id: 2, resource: 'r-2' },
  };

  function getSelected(id = '2') {
    const state = getState({
      'data.reservations': reservations,
      'data.resources': resources,
    });
    const props = {
      params: { id },
    };
    return reservationEditPageSelector(state, props);
  }

  it('returns reservation', () => {
    expect(getSelected().reservation).to.deep.equal(reservations[2]);
  });

  it('returns resource', () => {
    expect(getSelected().resource).to.deep.equal(resources['r-2']);
  });

  it('returns isFetching', () => {
    expect(getSelected().isFetching).to.be.false;
  });
});
