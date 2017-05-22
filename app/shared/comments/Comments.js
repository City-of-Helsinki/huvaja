import moment from 'moment';
import React, { PropTypes } from 'react';

import CommentAdder from './CommentAdder';
import FormattedUserText from './FormattedUserText';

function formatCreatedAt(datetime) {
  return moment(datetime).format('D.M.YYYY HH.mm');
}

Comments.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape({
    createdAt: PropTypes.string.isRequired,
    createdBy: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
    }).isRequired,
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
  createComment: PropTypes.func.isRequired,
};
export default function Comments(props) {
  return (
    <div className="comments">
      {props.comments.map(comment => (
        <div className="comments-comment" key={comment.id}>
          <div className="comments-comment-header">
            <div className="comments-comment-date">{formatCreatedAt(comment.createdAt)}</div>
            <div className="comments-comment-user">{comment.createdBy.displayName}</div>
          </div>
          <FormattedUserText className="comments-comment-content" text={comment.text} />
        </div>
      ))}
      <CommentAdder createComment={props.createComment} />
    </div>
  );
}
