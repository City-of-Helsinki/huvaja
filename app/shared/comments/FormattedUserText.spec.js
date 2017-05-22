import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import FormattedUserText from './FormattedUserText';

function getWrapper(props) {
  const defaults = { text: '' };
  return shallow(<FormattedUserText {...defaults} {...props} />);
}

describe('shared/comments/FormattedUserText', () => {
  it('renders a div.formatted-user-text', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.formatted-user-text')).to.be.true;
  });

  it('renders paragraph with one line', () => {
    const wrapper = getWrapper({ text: 'Hello, world!' });
    const expected = (
      <div className="formatted-user-text">
        <p>
          Hello, world!
        </p>
      </div>
    );
    expect(wrapper.matchesElement(expected)).to.be.true;
  });

  it('renders paragraph with multiple lines', () => {
    const wrapper = getWrapper({ text: 'Hello\nthere\nworld!' });
    const expected = (
      <div className="formatted-user-text">
        <p>
          Hello
          <br />
          there
          <br />
          world!
        </p>
      </div>
    );
    expect(wrapper.matchesElement(expected)).to.be.true;
  });

  it('renders multiple paragraphs', () => {
    const wrapper = getWrapper({ text: 'Hello!\n\nGoodbye!' });
    const expected = (
      <div className="formatted-user-text">
        <p>Hello!</p>
        <p>Goodbye!</p>
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
      <div className="formatted-user-text">
        <p>Dear Receipient,</p>
        <p>
          Here is a list of numbers:
          <br />
          - seven
          <br />
          - eighty-two point five
          <br />
          - negative one
        </p>
        <p>
          Best regards,
          <br />
          the Number Fairy
        </p>
      </div>
    );
    expect(wrapper.matchesElement(expected)).to.be.true;
  });
});
