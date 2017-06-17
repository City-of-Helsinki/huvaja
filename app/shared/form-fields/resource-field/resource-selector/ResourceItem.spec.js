import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import ResourceItem from './ResourceItem';

describe('shared/form-field/resource-field/resource-selector/ResourceItem', () => {
  const defaults = {
    available: true,
    hasBadCateringProvider: false,
    id: 'r-1',
    label: 'Unit 1 / Room 1',
    onSelect: () => null,
    peopleCapacity: 25,
  };

  function getWrapper(props) {
    return shallow(<ResourceItem {...defaults} {...props} />);
  }

  it('renders people capacity', () => {
    const capacity = getWrapper().find('.capacity');
    expect(capacity.contains(defaults.peopleCapacity)).to.be.true;
  });

  describe('div.resource-item', () => {
    it('is rendered', () => {
      const wrapper = getWrapper();
      expect(wrapper.is('div.resource-item')).to.be.true;
    });

    it('does not have "unavailable" class if available', () => {
      const wrapper = getWrapper({ available: true });
      expect(wrapper.hasClass('unavailable')).to.be.false;
    });

    it('has "unavailable" class if not available', () => {
      const wrapper = getWrapper({ available: false });
      expect(wrapper.hasClass('unavailable')).to.be.true;
    });

    it('does not have disabled class if hasBadCateringProvider is false', () => {
      const wrapper = getWrapper({ hasBadCateringProvider: false });
      expect(wrapper.hasClass('disabled')).to.be.false;
    });

    it('has disabled class if hasBadCateringProvider is true', () => {
      const wrapper = getWrapper({ hasBadCateringProvider: true });
      expect(wrapper.hasClass('disabled')).to.be.true;
    });
  });

  describe('label', () => {
    it('is rendered', () => {
      const label = getWrapper().find('.resource-item-label');
      expect(label.text()).to.equal(defaults.label);
    });

    it('includes catering warning if hasBadCateringProvider is true', () => {
      const wrapper = getWrapper({ hasBadCateringProvider: true });
      const label = wrapper.find('.resource-item-label');
      const text = label.find('.resource-item-disabled-text');
      expect(text).to.have.length(1);
      expect(text.text()).to.equal(
        'Valittu tarjoilutilaus ei ole mahdollinen tähän tilaan.'
      );
    });

    it('does not include catering warning if hasBadCateringProvider is false', () => {
      const wrapper = getWrapper({ hasBadCateringProvider: false });
      const label = wrapper.find('.resource-item-label');
      const text = label.find('.resource-item-disabled-text');
      expect(text).to.have.length(0);
    });
  });

  describe('onClick', () => {
    it('calls onSelect with resource id', () => {
      const onSelect = simple.mock();
      const link = getWrapper({ onSelect }).find('a');
      expect(link).to.have.length(1);
      link.simulate('click');
      expect(onSelect.callCount).to.equal(1);
      expect(onSelect.lastCall.arg).to.equal(defaults.id);
    });

    it('does not call onSelect if hasBadCateringProvider', () => {
      const onSelect = simple.mock();
      const props = { hasBadCateringProvider: true, onSelect };
      const link = getWrapper(props).find('a');
      expect(link).to.have.length(1);
      link.simulate('click');
      expect(onSelect.callCount).to.equal(0);
    });
  });
});
