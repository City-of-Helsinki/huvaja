import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Linkify from 'react-linkify';

import WrappedText from './WrappedText';

describe('shared/wrapped-text/WrappedText', () => {
  const defaultProps = {
    text: 'Some text',
  };

  function getWrapper(extraProps) {
    return shallow(<WrappedText {...defaultProps} {...extraProps} />);
  }

  it('has class "wrapped-text"', () => {
    const wrapper = getWrapper();
    expect(wrapper.hasClass('wrapped-text')).to.be.true;
  });

  describe('Text with one line', () => {
    const text = 'Just one line';
    let content;

    before(() => {
      content = getWrapper({ text }).children();
    });

    it('renders a p for the text', () => {
      const p = content.find('p');
      expect(p.length).to.equal(1);
    });

    it('uses Linkify to autolink the text', () => {
      const linkify = content.find(Linkify);
      expect(linkify.length).to.equal(1);
      expect(linkify.props().children).to.equal(text);
    });
  });

  describe('Text with multiple lines', () => {
    it('renders a br between each line', () => {
      const lines = ['First line', 'Second line', 'Third line'];
      const text = lines.join('\n');
      const content = getWrapper({ text }).children();

      const expected = (
        <p>
          <Linkify>First line</Linkify>
          <br />
          <Linkify>Second line</Linkify>
          <br />
          <Linkify>Third line</Linkify>
        </p>
      );
      expect(content.matchesElement(expected)).to.be.true;
    });

    it('renders multiple paragraphs', () => {
      const wrapper = getWrapper({ text: 'Hello!\n\nGoodbye!' });
      const expected = (
        <div className="wrapped-text">
          <p><Linkify>Hello!</Linkify></p>
          <p><Linkify>Goodbye!</Linkify></p>
        </div>
      );
      expect(wrapper.matchesElement(expected)).to.be.true;
    });

    it('renders multiple paragraphs with multiple lines', () => {
      const text = (
        'Dear Receipient,\n\n' +

        'Here is a list of numbers:\n' +
        '- seven\n' +
        '- eighty-two point five\n' +
        '- negative one\n\n' +

        'Best regards,\n' +
        'the Number Fairy'
      );
      const wrapper = getWrapper({ text });
      const expected = (
        <div className="wrapped-text">
          <p><Linkify>Dear Receipient,</Linkify></p>
          <p>
            <Linkify>Here is a list of numbers:</Linkify>
            <br />
            <Linkify>- seven</Linkify>
            <br />
            <Linkify>- eighty-two point five</Linkify>
            <br />
            <Linkify>- negative one</Linkify>
          </p>
          <p>
            <Linkify>Best regards,</Linkify>
            <br />
            <Linkify>the Number Fairy</Linkify>
          </p>
        </div>
      );
      expect(wrapper.matchesElement(expected)).to.be.true;
    });
  });
});
