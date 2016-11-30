import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import queryString from 'query-string';
import simple from 'simple-mock';
import React from 'react';
import { Link } from 'react-router';

import ReservationSlot from './ReservationSlot';
import utils from '../utils';

function getWrapper(props, context) {
  const defaults = {
    begin: moment(),
    end: moment().add(30, 'minutes'),
    resourceId: '1',
  };
  return shallow(<ReservationSlot {...defaults} {...props} />, { context });
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
    const query = queryString.stringify({ begin: begin.format(), reserve: true });
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

  describe('handleClick', () => {
    describe('if onReservationSlotClick given', () => {
      function callHandleClick({ preventDefault }, props) {
        const wrapper = getWrapper(
          { onClick: () => null, ...props },
          context
        );
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
});
