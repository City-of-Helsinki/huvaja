import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { createStructuredSelector } from 'reselect';

import { fetchComments } from 'api/actions';
import Comments from './Comments';

function commentsSelector() {
  return [
    {
      id: 1,
      content: 'Is it possible to have a 1:1 scale replica of Hogwarts in the room?',
      createdAt: '2017-01-01T10:18:39Z',
      user: { name: 'S. Snape' },
    },
    {
      id: 2,
      content: 'Best I can do is a 1:1 replica of Hogsmeade. Will that do?',
      createdAt: '2017-01-01T11:07:11Z',
      user: { name: 'Argus Filch' },
    },
    {
      id: 3,
      content: 'That will have to do.',
      createdAt: '2017-01-01T11:13:08Z',
      user: { name: 'S. Snape' },
    },
  ];
}

export const selector = createStructuredSelector({
  comments: commentsSelector,
});

export const actions = {
  fetchComments,
};

export class CommentsContainer extends React.Component {
  static propTypes = {
    comments: PropTypes.array.isRequired,
    fetchComments: PropTypes.func.isRequired,
    reservationId: PropTypes.number.isRequired,
  }

  componentWillMount() {
    this.props.fetchComments({ reservationId: this.props.reservationId });
  }

  render() {
    return <Comments comments={this.props.comments} />;
  }
}

export default connect(selector, actions)(CommentsContainer);
