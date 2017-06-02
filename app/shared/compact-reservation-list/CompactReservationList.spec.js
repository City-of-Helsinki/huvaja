import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import TimeRange from 'shared/time-range';
import CompactReservationList from './CompactReservationList';

describe('shared/compact-reservation-list/CompactReservationList', () => {
  const failureClass = 'compact-reservation-list-item-failure';
  const successClass = 'compact-reservation-list-item-success';
  const resource = Resource.build();
  const defaultProps = {
    reservations: immutable([
      Reservation.build({ resource: resource.id }),
      Reservation.build({ resource: 'unfetched-resource' }),
    ]),
    resourceNames: immutable({
      [resource.id]: 'Unit 1 / Resource 1',
    }),
    onRemoveClick: () => {},
  };

  function getWrapper(extraProps) {
    return shallow(<CompactReservationList {...defaultProps} {...extraProps} />);
  }

  it('renders a list for selected reservations', () => {
    const ul = getWrapper().find('ul.compact-reservation-list');
    expect(ul.length).to.equal(1);
  });

  it('renders a list element for each selected reservation', () => {
    const li = getWrapper().find('li');
    expect(li.length).to.equal(defaultProps.reservations.length);
  });

  it('gives correct class to list elements on success', () => {
    const li = getWrapper({ success: true }).find('li');
    expect(li.at(0).hasClass(successClass)).to.be.true;
    expect(li.at(0).hasClass(failureClass)).to.be.false;
  });

  it('gives correct class to list elements on failure', () => {
    const li = getWrapper({ failure: true }).find('li');
    expect(li.at(0).hasClass(successClass)).to.be.false;
    expect(li.at(0).hasClass(failureClass)).to.be.true;
  });

  describe('TimeRange', () => {
    it('is displayed for each selected reservation', () => {
      const timeRange = getWrapper().find(TimeRange);
      expect(timeRange.length).to.equal(defaultProps.reservations.length);
    });

    it('gets beginFormat and endFormat as props', () => {
      const beginFormat = 'dd, D.M.YYYY HH:mm';
      const endFormat = 'HH:mm';
      const props = { beginFormat, endFormat };
      const timeRange = getWrapper(props).find(TimeRange);
      expect(timeRange.at(0).prop('beginFormat')).to.equal(beginFormat);
      expect(timeRange.at(0).prop('endFormat')).to.equal(endFormat);
    });
  });

  describe('rendering resource name', () => {
    it('renders resource name if correct resource is given', () => {
      const li = getWrapper().find('li').at(0);
      expect(li.text()).to.contain('Unit 1 / Resource 1');
    });

    it('does not render resource name if correct resource is not given', () => {
      const li = getWrapper({ resources: undefined }).find('li').at(0);
      expect(li.text()).to.not.contain(resource.name);
    });
  });

  describe('subtitle', () => {
    it('is rendered if subtitle is specified', () => {
      const reservations = [Reservation.build({ foo: 'bar' })];
      const props = { reservations, subtitle: 'foo' };
      const subtitle = getWrapper(props).find('.compact-reservation-list-subtitle');
      expect(subtitle).to.have.length(1);
      expect(subtitle.text()).to.equal(reservations[0].foo);
    });

    it('is not rendered if subtitle is not specified', () => {
      expect(getWrapper().find('.compact-reservation-list-subtitle')).to.have.length(0);
    });
  });

  describe('remove button', () => {
    it('is rendered if reservation is in removableReservations', () => {
      const reservations = [Reservation.build({ foo: 'bar' })];
      const removableReservations = [
        Reservation.build(),
        Reservation.build(),
      ];
      const props = { reservations, removableReservations };
      const buttons = getWrapper(props).find({ glyph: 'remove-circle' });
      expect(buttons).to.have.length(2);
    });

    it('passes onRemoveClick func to onClick prop', () => {
      const onRemoveClick = simple.mock();
      const removableReservations = [Reservation.build()];
      const props = { onRemoveClick, removableReservations };
      const button = getWrapper(props).find({ glyph: 'remove-circle' });
      expect(onRemoveClick.callCount).to.equal(0);
      button.prop('onClick')();
      expect(onRemoveClick.lastCall.args).to.deep.equal(
        [removableReservations[0].begin]
      );
    });
  });
});
