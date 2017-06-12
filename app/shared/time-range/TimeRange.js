import upperFirst from 'lodash/upperFirst';
import moment from 'moment';
import React, { PropTypes } from 'react';

import constants from 'constants/AppConstants';

TimeRange.propTypes = {
  begin: PropTypes.string.isRequired,
  beginFormat: PropTypes.string.isRequired,
  className: PropTypes.string,
  end: PropTypes.string.isRequired,
  endFormat: PropTypes.string.isRequired,
};
TimeRange.defaultProps = {
  beginFormat: constants.DATETIME_FORMAT,
  endFormat: constants.TIME_FORMAT,
};
function TimeRange({
  begin,
  className,
  beginFormat,
  end,
  endFormat,
}) {
  const beginMoment = moment(begin);
  const endMoment = moment(end);
  const rangeString = `${beginMoment.format(beginFormat)} \u2013 ${endMoment.format(endFormat)}`;
  const ISORangeString = `${begin}/${end}`;

  return (
    <time className={className} dateTime={ISORangeString}>
      {upperFirst(rangeString)}
    </time>
  );
}

export default TimeRange;
