import { expect } from 'chai';
import moment from 'moment';

import { getState } from 'utils/testUtils';
import reservationSuccessModalSelector from './reservationSuccessModalSelector';

describe('modals/reservation-success/reservationSuccessModalSelector', () => {
  const resources = {
    'r-1': { id: 'r-1', name: { fi: 'Room 1' }, unit: 'u-1' },
    'r-2': { id: 'r-2', name: { fi: 'Room 2' }, unit: 'u-2' },
    'r-3': { id: 'r-3', name: { fi: 'Room 3' }, unit: 'u-3' },
  };
  const units = {
    'u-1': { id: 'u-1', name: { fi: 'Unit 1' } },
    'u-2': { id: 'u-2', name: { fi: 'Unit 2' } },
  };
  const rsv1 = { id: 124, begin: moment('2017-02-10T12:00') };
  const rsv2 = { id: 123, begin: moment('2017-02-11T12:00') };
  const rsv3 = { id: 126, begin: moment('2017-02-12T12:00') };
  const rsv4 = { id: 125, begin: moment('2017-02-13T12:00') };
  const rsv5 = { id: 127, begin: moment('2017-02-14T12:00') };

  function getSelected() {
    const state = getState({
      'data.resources': resources,
      'data.units': units,
      'modals.reservationSuccess': {
        created: [rsv2, rsv1],
        edited: rsv5,
        failed: [rsv4, rsv3],
        show: true,
      },
    });
    return reservationSuccessModalSelector(state);
  }

  it('returns createdReservations ordered by begin time', () => {
    expect(getSelected().createdReservations).to.deep.equal([rsv1, rsv2]);
  });

  it('returns editedReservation', () => {
    expect(getSelected().editedReservation).to.deep.equal(rsv5);
  });

  it('returns failedReservations ordered by begin time', () => {
    expect(getSelected().failedReservations).to.deep.equal([rsv3, rsv4]);
  });

  it('returns resourceNames', () => {
    const expected = {
      'r-1': 'Unit 1 / Room 1',
      'r-2': 'Unit 2 / Room 2',
      'r-3': null,
    };
    expect(getSelected().resourceNames).to.deep.equal(expected);
  });

  it('returns show', () => {
    expect(getSelected().show).to.be.true;
  });
});
