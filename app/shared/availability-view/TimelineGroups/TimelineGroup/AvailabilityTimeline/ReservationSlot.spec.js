import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import queryString from 'query-string';
import simple from 'simple-mock';
import React from 'react';

import ReservationSlot from './ReservationSlot';
import Link from './Link';
import utils from '../utils';

function getWrapper(props) {
  const defaults = {
    begin: moment(),
    end: moment().add(30, 'minutes'),
    isSelectable: true,
    resourceId: '1',
  };
  return shallow(<ReservationSlot {...defaults} {...props} />);
}

describe('shared/availability-view/ReservationSlot', () => {
  it('returns a Link.reservation-slot', () => {
    const wrapper = getWrapper();
    expect(wrapper.is(Link)).to.be.true;
    expect(wrapper.hasClass('reservation-slot')).to.be.true;
  });

  it('is link to correct location', () => {
    const begin = moment();
    const resourceId = '1234';
    const wrapper = getWrapper({ begin, resourceId });
    const query = queryString.stringify({ begin: begin.format() });
    expect(wrapper.prop('to')).to.equal(`/resources/${resourceId}?${query}`);
  });

  it('has correct width', () => {
    const expected = utils.getTimeSlotWidth();
    const actual = getWrapper().prop('style');
    expect(actual).to.deep.equal({ width: expected });
  });

  it('binds onClick to handleClick', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    expect(wrapper.prop('onClick')).to.equal(instance.handleClick);
  });

  describe('selection', () => {
    function isSelected(props, selection) {
      const defaultProps = {
        begin: moment('2016-01-01T10:00:00'),
        end: moment('2016-01-01T10:30:00'),
        selection: {
          begin: '2016-01-01T10:00:00',
          end: '2016-01-01T11:00:00',
          ...selection,
        },
      };
      const wrapper = getWrapper({ ...defaultProps, ...props });
      return wrapper.hasClass('reservation-slot-selected');
    }

    it('is selected if begin and end are same as selected', () => {
      const actual = isSelected({}, { end: '2016-01-01T10:30:00' });
      expect(actual).to.be.true;
    });

    it('is selected if begin and end are inside selected', () => {
      const actual = isSelected({}, { begin: '2016-01-01T09:00:00' });
      expect(actual).to.be.true;
    });

    it('is not selected if begin before selection', () => {
      const actual = isSelected({}, { begin: '2016-01-01T10:15:00' });
      expect(actual).to.be.false;
    });

    it('is not selected if end after selection', () => {
      const actual = isSelected({}, { end: '2016-01-01T10:15:00' });
      expect(actual).to.be.false;
    });

    it('is not selected if no selection', () => {
      const wrapper = getWrapper();
      const actual = wrapper.hasClass('reservation-slot-selected');
      expect(actual).to.be.false;
    });
  });

  describe('handleClick', () => {
    describe('if onReservationSlotClick given', () => {
      function callHandleClick({ preventDefault }, props) {
        const wrapper = getWrapper({ onClick: () => null, ...props });
        const event = { preventDefault: preventDefault || (() => null) };
        return wrapper.instance().handleClick(event);
      }

      it('calls event.preventDefault', () => {
        const preventDefault = simple.mock();
        callHandleClick({ preventDefault });
        expect(preventDefault.callCount).to.equal(1);
      });

      it('calls onReservationSlotClick', () => {
        const onClick = simple.mock();
        const begin = moment();
        const end = moment().add(30, 'minutes');
        callHandleClick({}, { begin, end, onClick });
        expect(onClick.callCount).to.equal(1);
        expect(onClick.lastCall.args).to.deep.equal([{
          begin: begin.format(),
          end: end.format(),
        }]);
      });
    });

    describe('if no click handler', () => {
      function callHandleClick({ preventDefault }) {
        const wrapper = getWrapper({ onClick: undefined });
        const event = { preventDefault: preventDefault || (() => null) };
        return wrapper.instance().handleClick(event);
      }

      it('does not call event.preventDefault', () => {
        const preventDefault = simple.mock();
        callHandleClick({ preventDefault });
        expect(preventDefault.called).to.be.false;
      });
    });
  });

  function createMouseTests(event) {
    const handle = `handleMouse${event}`;
    const callback = `onMouse${event}`;
    describe(handle, () => {
      it(`works if no props.${callback}`, () => {
        const wrapper = getWrapper({ [callback]: null });
        wrapper.instance()[handle]();
      });

      it(`calls props.${callback}`, () => {
        const begin = moment();
        const end = moment().add(30, 'minutes');
        const mock = simple.mock();
        const wrapper = getWrapper({ [callback]: mock, begin, end });
        wrapper.instance()[handle]();
        expect(mock.callCount).to.equal(1);
        expect(mock.lastCall.args).to.deep.equal([{
          begin: begin.format(),
          end: end.format(),
        }]);
      });
    });
  }

  createMouseTests('Down');
  createMouseTests('Enter');
  createMouseTests('Up');
});
