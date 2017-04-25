import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';

import Comments from './Comments';

function getWrapper(props) {
  const defaults = {
    comments: [],
  };
  return shallow(<Comments {...defaults} {...props} />);
}

describe('shared/comments/Comments', () => {
  it('renders a div.comments', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.comments')).to.be.true;
  });

  it('renders no comments if no comments', () => {
    const comments = getWrapper({ comments: [] }).find('.comments-comment');
    expect(comments).to.have.length(0);
  });

  describe('comment', () => {
    const comment = {
      id: 1,
      content: 'This comment is in the bag',
      createdAt: '2017-02-03T12:34:56.789+02:00',
      user: { name: 'Kunkka Shakearther' },
    };

    function getComment() {
      return getWrapper({ comments: [comment] }).find('.comments-comment');
    }

    it('is rendered', () => {
      expect(getComment()).to.have.length(1);
    });

    it('renders date', () => {
      const date = getComment().find('.comments-comment-date');
      expect(date).to.have.length(1);
      expect(date.text()).to.equal(moment(comment.createdAt).format('D.M.YYYY HH.mm'));
    });

    it('renders user name', () => {
      const name = getComment().find('.comments-comment-user');
      expect(name).to.have.length(1);
      expect(name.text()).to.equal(comment.user.name);
    });

    it('renders comment content', () => {
      const content = getComment().find('.comments-comment-content');
      expect(content).to.have.length(1);
      expect(content.text()).to.equal(comment.content);
    });
  });
});
