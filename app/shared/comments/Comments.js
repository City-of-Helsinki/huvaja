import moment from 'moment';
import React, { PropTypes } from 'react';

import CommentAdder from './CommentAdder';

function formatCreatedAt(datetime) {
  return moment(datetime).format('D.M.YYYY HH.mm');
}

Comments.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape({
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  })).isRequired,
};
export default function Comments(props) {
  return (
    <div className="comments">
      {props.comments.map(comment => (
        <div className="comments-comment" key={comment.id}>
          <div className="comments-comment-header">
            <div className="comments-comment-date">{formatCreatedAt(comment.createdAt)}</div>
            <div className="comments-comment-user">{comment.user.name}</div>
          </div>
          <div className="comments-comment-content">{comment.content}</div>
        </div>
      ))}
      <CommentAdder />
    </div>
  );
}
