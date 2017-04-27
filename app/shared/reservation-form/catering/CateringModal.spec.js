import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';

import CateringModal from './CateringModal';
import CateringForm from './catering-form';

describe('shared/reservation-form/catering/CateringModal', () => {
  function getWrapper(props) {
    const defaults = {
      onClose: () => null,
      show: true,
    };
    return shallow(<CateringModal {...defaults} {...props} />);
  }

  it('renders a Modal with correct class', () => {
    const modal = getWrapper().find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('className')).to.equal('catering-modal');
  });

  it('renders correct title', () => {
    const modalTitle = getWrapper().find(Modal.Title);
    expect(modalTitle).to.have.length(1);
    expect(modalTitle.prop('children')).to.equal('Lisää tarjoilutilaus');
  });

  it('renders CateringForm with correct props', () => {
    const onClose = () => null;
    const cateringModal = getWrapper({ onClose }).find(CateringForm);
    expect(cateringModal).to.have.length(1);
    expect(cateringModal.prop('onCancelCallback')).to.equal(onClose);
    expect(cateringModal.prop('onSubmitCallback')).to.equal(onClose);
  });
});
