import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';

import CommentForm from './CommentForm';

export default class CommentAdder extends React.Component {
  static propTypes = {
    createComment: PropTypes.func.isRequired,
  }
  state = { isOpen: false }

  toggle = (event) => {
    if (event) event.preventDefault();
    this.setState({ isOpen: !this.state.isOpen });
  }

  handleSubmit = data => (
    this.props.createComment(data)
      .then(() => { this.toggle(); })
  )

  render() {
    return (
      <div className="comment-adder">
        {this.state.isOpen && (
          <CommentForm
            onCancel={this.toggle}
            onSubmit={this.handleSubmit}
          />
        )}
        {!this.state.isOpen && (
          <Button bsStyle="default" onClick={this.toggle}>Kommentoi</Button>
        )}
      </div>
    );
  }
}
