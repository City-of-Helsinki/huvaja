import classNames from 'classnames';
import React, { PropTypes } from 'react';

function getParagraphs(text) {
  return text.split('\n\n');
}

function getLines(paragraph) {
  const result = [];
  const lines = paragraph.split('\n');
  lines.forEach((line, index) => {
    result.push(line);
    const isLastLine = index === lines.length - 1;
    if (!isLastLine) {
      result.push(<br key={index} />);
    }
  });
  return result;
}

FormattedUserText.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
};

export default function FormattedUserText({ className, text }) {
  return (
    <div className={classNames('formatted-user-text', className)}>
      {getParagraphs(text).map((paragraph, index) =>
        <p key={index}>
          {getLines(paragraph)}
        </p>
      )}
    </div>
  );
}
