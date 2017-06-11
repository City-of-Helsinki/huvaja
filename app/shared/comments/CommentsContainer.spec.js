import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import FontAwesome from 'react-fontawesome';
import simple from 'simple-mock';

import { fetchComments } from 'api/actions';
import { getState } from 'utils/testUtils';
import Comments from './Comments';
import { actions, CommentsContainer, mergeProps, selector } from './CommentsContainer';

function getWrapper(props) {
  const defaults = {
    comments: [],
    createComment: () => null,
    fetchComments: () => null,
    name: 'Varauksen viestit',
    reservationId: 1,
  };
  return shallow(<CommentsContainer {...defaults} {...props} />);
}

function getSelected(state, props = { reservationId: 1234 }) {
  return selector()(getState(state), props);
}

describe('shared/comments/CommentsContainer', () => {
  describe('container', () => {
    describe('componentWillMount', () => {
      it('calls fetchComments with reservation id', () => {
        const fetch = simple.mock();
        const reservationId = 1938;
        getWrapper({ fetchComments: fetch, reservationId });
        expect(fetch.callCount).to.equal(1);
        expect(fetch.lastCall.args).to.deep.equal([{
          cateringId: undefined,
          reservationId,
        }]);
      });

      it('calls fetchComments with catering id', () => {
        const fetch = simple.mock();
        const cateringId = 1938;
        getWrapper({ fetchComments: fetch, cateringId, reservationId: undefined });
        expect(fetch.callCount).to.equal(1);
        expect(fetch.lastCall.args).to.deep.equal([{
          cateringId,
          reservationId: undefined,
        }]);
      });
    });

    it('has correct initial state', () => {
      const wrapper = getWrapper();
      expect(wrapper.state()).to.deep.equal({ isOpen: false });
    });

    describe('toggleComments', () => {
      function toggleComments({ isOpen = false, preventDefault = (() => null), ...props }) {
        const wrapper = getWrapper(props);
        if (isOpen) wrapper.setState({ isOpen });
        wrapper.instance().toggleComments({ preventDefault });
        return wrapper;
      }

      it('calls event.preventDefault', () => {
        const preventDefault = simple.mock();
        toggleComments({ preventDefault });
        expect(preventDefault.callCount).to.equal(1);
        expect(preventDefault.lastCall.args).to.deep.equal([]);
      });

      it('sets isOpen from false to true if comments exist', () => {
        const comments = [{ id: 1, createdAt: '', createdBy: { displayName: '' }, text: '' }];
        const wrapper = toggleComments({ isOpen: false, comments });
        expect(wrapper.state('isOpen')).to.be.true;
      });

      it('sets isOpen from false to true if comments is []', () => {
        const comments = [];
        const wrapper = toggleComments({ isOpen: false, comments });
        expect(wrapper.state('isOpen')).to.be.true;
      });

      it('does not set isOpen from false to true if comments is null', () => {
        const comments = null;
        const wrapper = toggleComments({ isOpen: false, comments });
        expect(wrapper.state('isOpen')).to.be.false;
      });

      it('sets isOpen from true to false', () => {
        const wrapper = toggleComments({ isOpen: true });
        expect(wrapper.state('isOpen')).to.be.false;
      });
    });

    describe('render', () => {
      describe('toggle link', () => {
        function getLink({ comments = [], name = 'Name', isOpen = false } = {}) {
          const wrapper = getWrapper({ comments, name });
          if (isOpen) wrapper.setState({ isOpen });
          return wrapper.find('a');
        }

        it('renders toggle link', () => {
          const link = getLink();
          expect(link).to.have.length(1);
        });

        it('renders label when comments is null', () => {
          const link = getLink({ comments: null, name: 'Testin viestit' });
          expect(link.text()).to.equal('Testin viestit (-) <FontAwesome />');
        });

        it('renders label when comments is empty array', () => {
          const link = getLink({ comments: [], name: 'Testin viestit' });
          expect(link.text()).to.equal('Testin viestit (0) <FontAwesome />');
        });

        it('renders label when comments exist', () => {
          const comments = [{ id: 1, content: '', createdAt: '', user: { name: '' } }];
          const link = getLink({ comments, name: 'Testin viestit' });
          expect(link.text()).to.equal('Testin viestit (1) <FontAwesome />');
        });

        it('renders caret-down when open', () => {
          const icon = getLink({ isOpen: true }).find(FontAwesome);
          expect(icon).to.have.length(1);
          expect(icon.prop('name')).to.equal('caret-down');
        });

        it('renders caret-right when closed', () => {
          const icon = getLink({ isOpen: false }).find(FontAwesome);
          expect(icon).to.have.length(1);
          expect(icon.prop('name')).to.equal('caret-right');
        });
      });

      describe('Comments', () => {
        it('is not rendered if no comments', () => {
          const comments = null;
          const wrapper = getWrapper({ comments });
          expect(wrapper.state('isOpen')).to.be.false;
          const comment = wrapper.find(Comments);
          expect(comment).to.have.length(0);
        });

        it('is not rendered when closed', () => {
          const comments = [{ id: 1, createdAt: '', createdBy: { displayName: 'U' }, text: '?' }];
          const wrapper = getWrapper({ comments });
          expect(wrapper.state('isOpen')).to.be.false;
          const comment = wrapper.find(Comments);
          expect(comment).to.have.length(0);
        });

        it('is rendered when open', () => {
          const comments = [{ id: 1, createdAt: '', createdBy: { displayName: 'U' }, text: '?' }];
          const wrapper = getWrapper({ comments });
          wrapper.setState({ isOpen: true });
          const comment = wrapper.find(Comments);
          expect(comment).to.have.length(1);
          expect(comment.prop('comments')).to.equal(comments);
        });
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

    it('selects reservation comments', () => {
      const comments = [{ id: 1 }, { id: 2 }];
      const actual = getSelected(
        { 'data.comments': { 'reservation-1437': comments } },
        { reservationId: 1437 },
      );
      expect(actual.comments).to.deep.equal(comments);
    });

    it('selects catering comments', () => {
      const comments = [{ id: 1 }, { id: 2 }];
      const actual = getSelected(
        { 'data.comments': { 'catering_order-1437': comments } },
        { cateringId: 1437 },
      );
      expect(actual.comments).to.deep.equal(comments);
    });
  });

  describe('mergeProps', () => {
    describe('createComment', () => {
      function callCreateComment({ data, original, cateringId, reservationId }) {
        const merged = mergeProps(
          {},
          { createComment: original },
          { cateringId, reservationId },
        );
        merged.createComment(data);
      }

      it('calls original createComment with cateringId', () => {
        const createComment = simple.mock();
        const cateringId = 57871;
        const text = 'Hello!';
        callCreateComment({ data: { text }, original: createComment, cateringId });
        expect(createComment.callCount).to.equal(1);
        expect(createComment.lastCall.args).to.deep.equal([{
          cateringId,
          reservationId: undefined,
          text,
        }]);
      });

      it('calls original createComment with reservationId', () => {
        const createComment = simple.mock();
        const reservationId = 85881;
        const text = 'Hello!';
        callCreateComment({ data: { text }, original: createComment, reservationId });
        expect(createComment.callCount).to.equal(1);
        expect(createComment.lastCall.args).to.deep.equal([{
          cateringId: undefined,
          reservationId,
          text,
        }]);
      });
    });
  });
});
