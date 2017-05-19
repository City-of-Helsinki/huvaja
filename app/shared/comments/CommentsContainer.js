import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import { createStructuredSelector } from 'reselect';

import { createComment, fetchComments } from 'api/actions';
import { currentUserSelector } from 'auth/selectors';
import Comments from './Comments';

export function selector() {
  function commentsSelector(state, props) {
    const key = (
      props.reservationId
      ? `reservation-${props.reservationId}`
      : `catering-${props.cateringId}`
    );
    return state.data.comments[key];
  }

  return createStructuredSelector({
    comments: commentsSelector,
    user: currentUserSelector,
  });
}

export const actions = {
  createComment,
  fetchComments,
};

export function mergeProps(state, dispatch, props) {
  return {
    ...props,
    ...state,
    ...dispatch,
    createComment({ text }) {
      return dispatch.createComment({
        cateringId: props.cateringId,
        reservationId: props.reservationId,
        text,
      });
    },
  };
}

export class CommentsContainer extends React.Component {
  static propTypes = {
    cateringId: PropTypes.number,
    comments: PropTypes.array,
    createComment: PropTypes.func.isRequired,
    fetchComments: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    reservationId: PropTypes.number,
  }
  state = { isOpen: false }

  componentWillMount() {
    this.props.fetchComments({
      cateringId: this.props.cateringId,
      reservationId: this.props.reservationId,
    });
  }

  getCommentCount() {
    if (!this.props.comments) return '-';
    return this.props.comments.length;
  }

  toggleComments = (event) => {
    event.preventDefault();
    const canToggle = this.state.isOpen || this.props.comments;
    if (canToggle) {
      this.setState({ isOpen: !this.state.isOpen });
    }
  }

  render() {
    return (
      <div className="comments-container">
        <a className="comments-container-toggle" onClick={this.toggleComments} tabIndex="0">
          {this.props.name} ({this.getCommentCount()})
          {' '}
          <FontAwesome name={this.state.isOpen ? 'caret-down' : 'caret-right'} />
        </a>
        {this.state.isOpen && (
          <Comments
            comments={this.props.comments}
            createComment={this.props.createComment}
          />
        )}
      </div>
    );
  }
}

export default connect(selector, actions, mergeProps)(CommentsContainer);
