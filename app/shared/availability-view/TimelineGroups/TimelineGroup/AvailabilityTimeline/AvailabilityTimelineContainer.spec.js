import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';

import AvailabilityTimeline from './AvailabilityTimeline';
import AvailabilityTimelineContainer, { selector } from './AvailabilityTimelineContainer';

const slotSize = 30; // minutes

function getState() {
  return {
    data: {
      resources: {
        'resource-1': {
          id: 'resource-1',
          reservations: [
            {
              id: 'reservation-1',
              name: 'Reservation 1',
              begin: moment('2016-01-01T02:00:00').format(),
              end: moment('2016-01-01T10:00:00').format(),
            },
            {
              id: 'reservation-2',
              name: 'Reservation 2',
              begin: moment('2016-01-01T11:30:00').format(),
              end: moment('2016-01-01T18:00:00').format(),
            },
            {
              id: 'reservation-3',
              name: 'Reservation 3',
              begin: moment('2016-01-01T18:00:00').format(),
              end: moment('2016-01-01T23:30:00').format(),
            },
          ],
        },
        'resource-2': { id: 'resource-2' },
      },
    },
  };
}

function getWrapper(props) {
  const defaults = {
    date: moment('2016-01-01T00:00:00'),
    id: 'resource-1',
    store: { getState },
  };
  return shallow(<AvailabilityTimelineContainer {...defaults} {...props} />);
}

describe('shared/availability-view/AvailabilityTimelineContainer', () => {
  it('renders a AvailabilityTimeline', () => {
    const wrapper = getWrapper();
    expect(wrapper.is(AvailabilityTimeline)).to.be.true;
  });

  it('renders a AvailabilityTimeline even if no reservations', () => {
    const wrapper = getWrapper({ id: 'resource-2' });
    expect(wrapper.is(AvailabilityTimeline)).to.be.true;
  });

  describe('selector', () => {
    function getSelected(props) {
      const defaults = { id: 'resource-1', date: moment('2016-01-01T00:00:00') };
      return selector()(getState(), { ...defaults, ...props });
    }

    describe('items', () => {
      it('contains slots if no reservations', () => {
        const actual = getSelected({ id: 'resource-2' }).items;
        expect(actual).to.have.length((24 * 60) / slotSize);
        actual.forEach(slot => expect(slot.type).to.equal('reservation-slot'));
      });

      it('contains slots if no reservations for date', () => {
        const actual = getSelected({ date: moment('2016-01-02T00:00:00') }).items;
        expect(actual).to.have.length((24 * 60) / slotSize);
        actual.forEach(slot => expect(slot.type).to.equal('reservation-slot'));
      });

      it('contains reservations and slots', () => {
        const reservations = getState().data.resources['resource-1'].reservations;
        const actual = getSelected().items;
        expect(actual).to.deep.equal([
          { key: '0', type: 'reservation-slot' },
          { key: '1', type: 'reservation-slot' },
          { key: '2', type: 'reservation-slot' },
          { key: '3', type: 'reservation-slot' },
          { key: 'reservation-1', type: 'reservation', data: reservations[0] },
          { key: '5', type: 'reservation-slot' },
          { key: '6', type: 'reservation-slot' },
          { key: '7', type: 'reservation-slot' },
          { key: 'reservation-2', type: 'reservation', data: reservations[1] },
          { key: 'reservation-3', type: 'reservation', data: reservations[2] },
          { key: '10', type: 'reservation-slot' },
        ]);
      });
    });
  });
});
