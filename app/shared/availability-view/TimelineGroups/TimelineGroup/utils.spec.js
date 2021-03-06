import { expect } from 'chai';
import moment from 'moment';

import utils from './utils';

describe('shared/availability-view/utils', () => {
  describe('getTimeSlotWidth', () => {
    const slotWidth = 30;
    const slotMargin = 0;

    it('returns one slot width with no arguments', () => {
      const actual = utils.getTimeSlotWidth();
      expect(actual).to.equal(slotWidth - slotMargin);
    });

    it('returns one slot width for 30 min span', () => {
      const actual = utils.getTimeSlotWidth({
        startTime: moment('2016-01-01T12:00:00Z'),
        endTime: moment('2016-01-01T12:30:00Z'),
      });
      expect(actual).to.equal(slotWidth - slotMargin);
    });

    it('returns two slot width for 1 hour span', () => {
      const actual = utils.getTimeSlotWidth({
        startTime: moment('2016-01-01T12:00:00Z'),
        endTime: moment('2016-01-01T13:00:00Z'),
      });
      expect(actual).to.equal((slotWidth * 2) - slotMargin);
    });

    it('returns twenty slot width for 10 hour span', () => {
      const actual = utils.getTimeSlotWidth({
        startTime: moment('2016-01-01T12:00:00Z'),
        endTime: moment('2016-01-01T22:00:00Z'),
      });
      expect(actual).to.equal((slotWidth * 20) - slotMargin);
    });
  });

  describe('roundDateToSlotSize', () => {
    it('rounds Dates and moments not conforming to the slot divisions to the nearest slot division', () => {
      const unrounded = moment('2017-01-01T12:03:00Z');
      const roundedUp = utils.roundDateToSlotSize(unrounded, 30, 1);
      const roundedDown = utils.roundDateToSlotSize(unrounded, 30, -1);
      expect(roundedUp.isSame(moment('2017-01-01T12:30:00Z'))).to.be.true;
      expect(roundedDown.isSame(moment('2017-01-01T12:00:00Z'))).to.be.true;
      expect(() => utils.roundDateToSlotSize(unrounded, 13, 1)).to.throw(RangeError, 'divisible');
    });
  });

  describe('getTimelineItems', () => {
    it('returns reservation slots if reservations is undefined', () => {
      const actual = utils.getTimelineItems(moment('2016-01-01T00:00:00Z'), undefined, '1');
      expect(actual).to.have.length(48);
      actual.forEach(item => expect(item.type).to.equal('reservation-slot'));
    });

    it('returns reservation slots if reservations is empty', () => {
      const actual = utils.getTimelineItems(moment('2016-01-01T00:00:00Z'), [], '1');
      expect(actual).to.have.length(48);
      actual.forEach(item => expect(item.type).to.equal('reservation-slot'));
    });

    it('returns one reservation if entire day is a reservation', () => {
      const reservation = { id: 11, begin: '2016-01-01T00:00:00', end: '2016-01-02T00:00:00', visualBegin: '2016-01-01T00:00:00', visualEnd: '2016-01-02T00:00:00' };
      const actual = utils.getTimelineItems(moment('2016-01-01T00:00:00'), [reservation], '1');
      expect(actual).to.have.length(1);
      expect(actual[0]).to.deep.equal({
        key: '0',
        type: 'reservation',
        data: reservation,
      });
    });

    it('returns reservations and slots', () => {
      const reservations = [
        { id: 11, begin: '2016-01-01T02:00:00', end: '2016-01-01T10:00:00', visualBegin: '2016-01-01T02:00:00', visualEnd: '2016-01-01T10:00:00' },
        { id: 12, begin: '2016-01-01T12:30:00', end: '2016-01-01T20:00:00', visualBegin: '2016-01-01T12:30:00', visualEnd: '2016-01-01T20:00:00' },
        { id: 13, begin: '2016-01-01T20:00:00', end: '2016-01-01T20:30:00', visualBegin: '2016-01-01T20:00:00', visualEnd: '2016-01-01T20:30:00' },
      ];
      const actual = utils.getTimelineItems(
        moment('2016-01-01T00:00:00'),
        reservations,
        {
          id: '1',
          openingHours: [
            {
              opens: '2016-01-01T08:00:00',
              closes: '2016-01-01T10:00:00',
            },
            {
              opens: '2016-01-01T12:00:00',
              closes: '2016-01-01T20:30:00',
            },
          ],
        },
      );
      const actualFormatted = actual.map((item) => {
        if (item.type === 'reservation') return item;
        return {
          ...item,
          data: {
            ...item.data,
            begin: item.data.begin.format(),
            end: item.data.end.format(),
          },
        };
      });
      const expected = [
        {
          key: '0',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T00:00:00').format(),
            end: moment('2016-01-01T00:30:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '1',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T00:30:00').format(),
            end: moment('2016-01-01T01:00:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '2',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T01:00:00').format(),
            end: moment('2016-01-01T01:30:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '3',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T01:30:00').format(),
            end: moment('2016-01-01T02:00:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        { key: '4', type: 'reservation', data: reservations[0] },
        {
          key: '5',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T10:00:00').format(),
            end: moment('2016-01-01T10:30:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '6',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T10:30:00').format(),
            end: moment('2016-01-01T11:00:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '7',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T11:00:00').format(),
            end: moment('2016-01-01T11:30:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '8',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T11:30:00').format(),
            end: moment('2016-01-01T12:00:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '9',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T12:00:00').format(),
            end: moment('2016-01-01T12:30:00').format(),
            resourceId: '1',
            isSelectable: true,
          },
        },
        { key: '10', type: 'reservation', data: reservations[1] },
        { key: '11', type: 'reservation', data: reservations[2] },
        {
          key: '12',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T20:30:00').format(),
            end: moment('2016-01-01T21:00:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '13',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T21:00:00').format(),
            end: moment('2016-01-01T21:30:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '14',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T21:30:00').format(),
            end: moment('2016-01-01T22:00:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '15',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T22:00:00').format(),
            end: moment('2016-01-01T22:30:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '16',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T22:30:00').format(),
            end: moment('2016-01-01T23:00:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '17',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T23:00:00').format(),
            end: moment('2016-01-01T23:30:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '18',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T23:30:00').format(),
            end: moment('2016-01-02T00:00:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
      ];
      expect(actualFormatted).to.deep.equal(expected);
    });

    it('supports excluding reservation', () => {
      const reservations = [
        { id: 11, begin: '2016-01-01T00:30:00', end: '2016-01-01T01:30:00', visualBegin: '2016-01-01T00:30:00', visualEnd: '2016-01-01T01:30:00' },
        { id: 12, begin: '2016-01-01T02:00:00', end: '2016-01-02T00:00:00', visualBegin: '2016-01-01T02:00:00', visualEnd: '2016-01-02T00:00:00' },
      ];
      const excludeReservation = reservations[0].id;
      const actual = utils.getTimelineItems(
        moment('2016-01-01T00:00:00'),
        reservations,
        {
          id: '1',
          openingHours: [],
        },
        excludeReservation,
      );
      const actualFormatted = actual.map((item) => {
        if (item.type === 'reservation') return item;
        return {
          ...item,
          data: {
            ...item.data,
            begin: item.data.begin.format(),
            end: item.data.end.format(),
          },
        };
      });
      const expected = [
        {
          key: '0',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T00:00:00').format(),
            end: moment('2016-01-01T00:30:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '1',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T00:30:00').format(),
            end: moment('2016-01-01T01:00:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '2',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T01:00:00').format(),
            end: moment('2016-01-01T01:30:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        {
          key: '3',
          type: 'reservation-slot',
          data: {
            begin: moment('2016-01-01T01:30:00').format(),
            end: moment('2016-01-01T02:00:00').format(),
            resourceId: '1',
            isSelectable: false,
          },
        },
        { key: '4', type: 'reservation', data: reservations[1] },
      ];
      expect(actualFormatted).to.deep.equal(expected);
    });
  });
});
