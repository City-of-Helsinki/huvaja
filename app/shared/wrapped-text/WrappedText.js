import classNames from 'classnames';
import React, { PropTypes } from 'react';
import Linkify from 'react-linkify';

function getParagraphs(text) {
  return text.split('\n\n');
}

function getLines(paragraph) {
  const result = [];
  const lines = paragraph.split('\n');
  lines.forEach((line, index) => {
    result.push(<Linkify key={`link-${index}`}>{line}</Linkify>);
    const isLastLine = index === lines.length - 1;
    if (!isLastLine) {
      result.push(<br key={`br-${index}`} />);
    }
  });
  return result;
}

function renderParagraph(text, index) {
  return <p key={`p-${index}`}>{getLines(text)}</p>;
}

function WrappedText({ className, text }) {
  return (
    <div className={classNames('wrapped-text', className)}>
      {getParagraphs(text).map(renderParagraph)}
    </div>
  );
}

WrappedText.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
};

export default WrappedText;
