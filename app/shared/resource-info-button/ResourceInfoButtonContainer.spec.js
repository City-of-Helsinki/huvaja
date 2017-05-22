import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import { UnconnectedResourceInfoButtonContainer as ResourceInfoButtonContainer } from './ResourceInfoButtonContainer';

describe('shared/resource-info-button/ResourceInfoButtonContainer', () => {
  const defaults = {
    resourceId: 'r-1',
    showResourceInfoModal: () => null,
  };

  function getWrapper(props) {
    return shallow(<ResourceInfoButtonContainer {...defaults} {...props} />);
  }

  describe('render', () => {
    it('renders div.resource-info-button', () => {
      expect(getWrapper().is('div.resource-info-button')).to.be.true;
    });

    describe('link', () => {
      it('is rendered', () => {
        const link = getWrapper().find('a');
        expect(link).to.have.length(1);
      });

      it('shows modal on click', () => {
        const showResourceInfoModal = simple.mock();
        const link = getWrapper({ showResourceInfoModal }).find('a');
        link.simulate('click');
        expect(showResourceInfoModal.callCount).to.equal(1);
        expect(showResourceInfoModal.lastCall.arg).to.equal('r-1');
      });
    });
  });
});
