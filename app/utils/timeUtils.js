import moment from 'moment';

function parseDateTime(value) {
  const parsed = moment(value, moment.ISO_8601, true);
  return parsed.isValid() ? parsed : null;
}

function getDateTimeRangeFieldMoments(value) {
  const begin = value && value.begin.date && value.begin.time ?
    parseDateTime(`${value.begin.date} ${value.begin.time}`) :
    null;
  const end = value && value.end.date && value.end.time ?
    parseDateTime(`${value.end.date} ${value.end.time}`) :
    null;
  return { begin, end };
}

export default {
  getDateTimeRangeFieldMoments,
  parseDateTime,
};
