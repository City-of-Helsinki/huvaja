import { decamelizeKeys } from 'humps';
import omitBy from 'lodash/omitBy';
import queryString from 'query-string';

import timeUtils from 'utils/timeUtils';

function getAvailableBetween(startDate, startTime, endDate, endTime) {
  const start = timeUtils.parseDateTime(`${startDate} ${startTime}`);
  const end = timeUtils.parseDateTime(`${endDate} ${endTime}`);
  return start && end ? `${start.toISOString()},${end.toISOString()}` : '';
}

function getEffectiveFilters(filters) {
  const {
    availableStartDate,
    availableStartTime,
    availableEndDate,
    availableEndTime,
    ...rest
  } = filters;
  const availableBetween = getAvailableBetween(
    availableStartDate,
    availableStartTime,
    availableEndDate,
    availableEndTime,
  );
  return {
    availableBetween,
    ...rest,
  };
}

function getUrl(filters) {
  const effective = getEffectiveFilters(filters);
  const cleaned = omitBy(effective, value => value === '');
  const decamelized = decamelizeKeys(cleaned);
  const urlParams = queryString.stringify(decamelized);
  return `/?${urlParams}`;
}

export default {
  getEffectiveFilters,
  getUrl,
};
