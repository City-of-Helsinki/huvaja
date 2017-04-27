import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import simple from 'simple-mock';

import CommentAdder from './CommentAdder';
import CommentForm from './CommentForm';

function getWrapper(props, { isOpen = false } = {}) {
  const defaults = {
    createComment: () => Promise.resolve(),
  };
  const wrapper = shallow(<CommentAdder {...defaults} {...props} />);
  if (isOpen) wrapper.setState({ isOpen });
  return wrapper;
}

describe('shared/comments/CommentAdder', () => {
  it('renders a div.comment-adder', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.comment-adder')).to.be.true;
  });

  it('has correct initial state', () => {
    const wrapper = getWrapper();
    expect(wrapper.state()).to.deep.equal({ isOpen: false });
  });

  describe('handleSubmit', () => {
    it('calls props.createComment', () => {
      const createComment = simple.mock().returnWith(Promise.reject());
      const wrapper = getWrapper({ createComment });
      const data = { some: 'data' };
      wrapper.instance().handleSubmit(data);
      expect(createComment.callCount).to.equal(1);
      expect(createComment.lastCall.arg).to.equal(data);
    });
  });

  describe('when closed', () => {
    function getClosed() {
      return getWrapper({}, { isOpen: false });
    }

    it('renders a button', () => {
      const wrapper = getClosed();
      const button = wrapper.find(Button);
      expect(button).to.have.length(1);
      expect(button.prop('onClick')).to.equal(wrapper.instance().toggle);
    });

    it('does not render CommentForm', () => {
      const form = getClosed().find(CommentForm);
      expect(form).to.have.length(0);
    });

    it('opens when toggle called', () => {
      const wrapper = getClosed();
      wrapper.instance().toggle();
      expect(wrapper.state()).to.deep.equal({ isOpen: true });
    });
  });

  describe('when open', () => {
    function getOpen() {
      return getWrapper({}, { isOpen: true });
    }

    it('does not render a button', () => {
      const button = getOpen().find(Button);
      expect(button).to.have.length(0);
    });

    it('renders a CommentForm', () => {
      const wrapper = getOpen();
      const form = wrapper.find(CommentForm);
      expect(form).to.have.length(1);
      expect(form.prop('onCancel')).to.equal(wrapper.instance().toggle);
      expect(form.prop('onSubmit')).to.equal(wrapper.instance().handleSubmit);
    });

    it('closes when toggle called', () => {
      const wrapper = getOpen();
      wrapper.instance().toggle();
      expect(wrapper.state()).to.deep.equal({ isOpen: false });
    });
  });
});
