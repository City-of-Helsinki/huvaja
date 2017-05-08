import moment from 'moment';

function parseBeginDate(apiSuccessAction) {
  return moment(apiSuccessAction.payload.begin).format('YYYY-MM-DD');
}

function getResourceUrl(resourceId, begin) {
  return `/resources/${resourceId}?begin=${begin}`;
}

export default {
  getResourceUrl,
  parseBeginDate,
};
