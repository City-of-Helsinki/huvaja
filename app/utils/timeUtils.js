import moment from 'moment';

function parseDateTime(value) {
  const parsed = moment(value, moment.ISO_8601, true);
  return parsed.isValid() ? parsed : null;
}

export default {
  parseDateTime,
};
