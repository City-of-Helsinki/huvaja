import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Field } from 'redux-form';

import { UnconnectedCommentForm as CommentForm } from './CommentForm';

function getWrapper(props) {
  const defaults = {
    handleSubmit: () => null,
    onCancel: () => null,
  };
  return shallow(<CommentForm {...defaults} {...props} />);
}

describe('shared/comments/CommentForm', () => {
  it('is a form.comment-form', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('form.comment-form')).to.be.true;
  });

  it('has correct submit handler', () => {
    const handleSubmit = () => null;
    const form = getWrapper({ handleSubmit }).find('form');
    expect(form.prop('onSubmit')).to.equal(handleSubmit);
  });

  it('renders field', () => {
    const field = getWrapper().find(Field);
    expect(field).to.have.length(1);
    expect(field.prop('component')).to.equal('textarea');
    expect(field.prop('name')).to.equal('content');
    expect(field.prop('withRef')).to.be.true;
  });

  it('renders buttons', () => {
    const onCancel = () => null;
    const buttons = getWrapper({ onCancel }).find(Button);
    expect(buttons).to.have.length(2);
    const submit = <Button bsStyle="primary" type="submit">Tallenna kommentti</Button>;
    const cancel = <Button bsStyle="default" onClick={onCancel}>Peruuta</Button>;
    expect(buttons.contains(submit)).to.be.true;
    expect(buttons.contains(cancel)).to.be.true;
  });
});
