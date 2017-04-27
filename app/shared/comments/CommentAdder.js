import React from 'react';
import Button from 'react-bootstrap/lib/Button';

import CommentForm from './CommentForm';

export default class CommentAdder extends React.Component {
  state = { isOpen: false }

  toggle = (event) => {
    if (event) event.preventDefault();
    this.setState({ isOpen: !this.state.isOpen });
  }

  handleSubmit = (data) => {
    this.toggle();
    console.log('Submitted!', data);
  }

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
