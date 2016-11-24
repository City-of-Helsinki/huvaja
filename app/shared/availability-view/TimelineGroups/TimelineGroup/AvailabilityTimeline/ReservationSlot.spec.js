import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import queryString from 'query-string';
import React from 'react';
import { Link } from 'react-router';

import ReservationSlot from './ReservationSlot';
import utils from '../utils';

function getWrapper(props) {
  const defaults = {
    begin: moment(),
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
    const query = queryString.stringify({ begin: begin.format(), reserve: true });
    expect(wrapper.prop('to')).to.equal(`/resources/${resourceId}?${query}`);
  });

  it('has correct width', () => {
    const expected = utils.getTimeSlotWidth();
    const actual = getWrapper().prop('style');
    expect(actual).to.deep.equal({ width: expected });
  });
});
