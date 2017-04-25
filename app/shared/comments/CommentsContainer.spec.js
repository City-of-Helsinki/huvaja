import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import { fetchComments } from 'api/actions';
import { getState } from 'utils/testUtils';
import Comments from './Comments';
import { actions, CommentsContainer, selector } from './CommentsContainer';

function getWrapper(props) {
  const defaults = {
    comments: [],
    fetchComments: () => null,
    reservationId: 1,
  };
  return shallow(<CommentsContainer {...defaults} {...props} />);
}

function getSelected(state, props) {
  return selector(getState(state), props);
}

describe('shared/comments/CommentsContainer', () => {
  describe('container', () => {
    describe('componentWillMount', () => {
      it('calls fetchComments with reservation id', () => {
        const fetchComments = simple.mock();
        const reservationId = 1938;
        const instance = getWrapper({ fetchComments, reservationId }).instance();
        expect(fetchComments.callCount).to.equal(1);
        expect(fetchComments.lastCall.args).to.deep.equal([{ reservationId }]);
      });
    });

    describe('render', () => {
      it('renders Comments with comments', () => {
        const comments = [{ id: 1, content: 'Comment', createdAt: '', user: { name: 'U' } }];
        const comment = getWrapper({ comments }).find(Comments);
        expect(comment).to.have.length(1);
        expect(comment.prop('comments')).to.equal(comments);
      });
    });
  });

  describe('actions', () => {
    it('has fetchComments', () => {
      expect(actions.fetchComments).to.equal(fetchComments);
    });
  });

  describe('selectors', () => {
    it('selects comments', () => {
      const actual = getSelected();
      expect(actual.comments).to.be.truthy;
    });
  });
});
