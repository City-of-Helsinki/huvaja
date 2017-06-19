import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { Link } from 'react-router';

import AvailabilityViewResourceInfoContainer, { AvailabilityViewResourceInfo, selector } from './AvailabilityViewResourceInfoContainer';

function getState() {
  return {
    data: {
      resources: {
        123456: {
          id: '123456',
          name: { fi: 'Resource Name' },
          peopleCapacity: 9,
          extra: 'attribute',
          isFavorite: false,
          userPermissions: { canMakeReservations: true },
        },
      },
    },
  };
}

describe('shared/availability-view/AvailabilityViewResourceInfoContainer', () => {
  describe('container', () => {
    function getWrapper(props) {
      const defaults = {
        date: '2016-01-01',
        id: '123456',
        store: { getState },
      };
      return shallow(<AvailabilityViewResourceInfoContainer {...defaults} {...props} />);
    }

    it('renders a AvailabilityViewResourceInfo', () => {
      const wrapper = getWrapper();
      expect(wrapper.is(AvailabilityViewResourceInfo)).to.be.true;
    });
  });

  describe('component', () => {
    function getWrapper(props) {
      const defaults = {
        canMakeReservations: true,
        date: '2016-01-01',
        id: 'r-1',
        isFavorite: false,
        name: 'Resource name',
        peopleCapacity: 19,
      };
      return shallow(<AvailabilityViewResourceInfo {...defaults} {...props} />);
    }

    it('renders a div.availability-view-resource-info', () => {
      const wrapper = getWrapper();
      expect(wrapper.is('div.availability-view-resource-info')).to.be.true;
    });

    it('renders the name and link to resource page', () => {
      const date = '2016-05-05';
      const link = getWrapper({ date, id: 'r-1', name: 'Room 1' }).find(Link);
      expect(link).to.have.length(1);
      expect(link.prop('to')).to.equal(`/resources/r-1?begin=${date}`);
      expect(link.prop('children')).to.equal('Room 1');
    });

    it('renders the capacity', () => {
      const capacity = getWrapper({ peopleCapacity: 3 }).find('.capacity');
      expect(capacity).to.have.length(1);
      expect(capacity.text()).to.contain('3');
    });

    describe('favorite-icon', () => {
      it('is rendered if isFavorite prop is true', () => {
        const favoriteIcon = getWrapper({ isFavorite: true }).find('.favorite-icon');
        expect(favoriteIcon).to.have.length(1);
        expect(favoriteIcon.prop('name')).to.equal('heart');
      });

      it('is not rendered if isFavorite prop is false', () => {
        const favoriteIcon = getWrapper({ isFavorite: false }).find('.favorite-icon');
        expect(favoriteIcon).to.have.length(0);
      });
    });

    it('does not add can-make-reservations class if not canMakeReservations', () => {
      const wrapperWithoutClass = (
        getWrapper({
          canMakeReservations: false,
        }).filter('.availability-view-resource-info-can-make-reservations')
      );
      expect(wrapperWithoutClass).to.have.length(0);
    });

    it('adds can-make-reservations class if canMakeReservations', () => {
      const wrapperWithClass = (
        getWrapper().filter('.availability-view-resource-info-can-make-reservations')
      );
      expect(wrapperWithClass).to.have.length(1);
    });
  });

  describe('selector', () => {
    function getSelected(props) {
      const defaults = { id: '123456' };
      return selector()(getState(), { ...defaults, ...props });
    }

    it('returns resource info', () => {
      const actual = getSelected();
      expect(actual).to.deep.equal({
        canMakeReservations: true,
        isFavorite: false,
        name: 'Resource Name',
        peopleCapacity: 9,
      });
    });
  });
});
