import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import reservationRowSelector from './reservationRowSelector';

describe('pages/search/reservationRowSelector', () => {
  const reservations = {
    36: {
      id: 36,
      begin: '2017-01-01T09:00:00',
      end: '2017-01-01T10:00:00',
      eventSubject: 'Meeting',
      hostName: 'Jaska',
      numberOfParticipants: 15,
      resource: 'r-1',
    },
    37: {
      id: 37,
      begin: '2017-01-02T09:00:00',
      end: '2017-01-02T10:00:00',
    },
  };
  const resources = {
    'r-1': { id: 'r-1', name: { fi: 'Room 1' }, unit: 'u-1' },
    'r-2': { id: 'r-2', name: { fi: 'Room 2' }, unit: 'u-2' },
  };
  const units = {
    'u-1': { id: 'u-1', name: { fi: 'Unit 1' } },
    'u-2': { id: 'u-2', name: { fi: 'Unit 2' } },
  };

  function getSelected(id) {
    const state = getState({
      'data.reservations': reservations,
      'data.resources': resources,
      'data.units': units,
    });
    const props = { id };
    return reservationRowSelector(state, props);
  }

  let selected;

  describe('reservation with full data', () => {
    before(() => {
      selected = getSelected(36);
    });

    it('returns eventSubject', () => {
      expect(selected.eventSubject).to.equal('Meeting');
    });

    it('returns hostName', () => {
      expect(selected.hostName).to.equal('Jaska');
    });

    it('returns id', () => {
      expect(selected.id).to.equal(36);
    });

    it('returns numberOfParticipants', () => {
      expect(selected.numberOfParticipants).to.equal(15);
    });

    it('returns place', () => {
      expect(selected.place).to.equal('Unit 1 / Room 1');
    });

    it('returns timeRange', () => {
      expect(selected.timeRange).to.equal('09:00–10:00');
    });
  });

  describe('reservation with partial data', () => {
    before(() => {
      selected = getSelected(37);
    });

    it('returns eventSubject', () => {
      expect(selected.eventSubject).to.equal('Tuntematon varauksen nimi');
    });

    it('returns hostName', () => {
      expect(selected.hostName).to.equal('Tuntematon isäntä');
    });

    it('returns id', () => {
      expect(selected.id).to.equal(37);
    });

    it('returns numberOfParticipants as null when missing', () => {
      expect(selected.numberOfParticipants).to.be.null;
    });

    it('returns place', () => {
      expect(selected.place).to.equal('Tuntematon tila');
    });

    it('returns timeRange', () => {
      expect(selected.timeRange).to.equal('09:00–10:00');
    });
  });
});
