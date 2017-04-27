import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Field, reduxForm } from 'redux-form';

function validate(values) {
  if (!values.content) {
    return { content: 'Pakollinen tieto' };
  }
  return {};
}

function focusElement(element) {
  if (element) {
    element.getRenderedComponent().focus();
  }
}

UnconnectedCommentForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
export function UnconnectedCommentForm(props) {
  return (
    <form className="comment-form" onSubmit={props.handleSubmit}>
      <Field
        className="form-control"
        component="textarea"
        label="Kommentti*"
        name="content"
        ref={focusElement}
        withRef
      />
      <div className="form-controls">
        <Button bsStyle="primary" type="submit">Tallenna kommentti</Button>
        <Button bsStyle="default" onClick={props.onCancel}>Peruuta</Button>
      </div>
    </form>
  );
}

export default reduxForm({
  form: 'comment',
  validate,
})(UnconnectedCommentForm);
