import moment from 'moment';

function formatServingTime(time) {
  return moment(time, 'HH:mm:ss').format('H:mm');
}

function getServingTimeText(servingTime) {
  return servingTime ?
    formatServingTime(servingTime) :
    'Varauksen alkamisaika';
}

export default {
  formatServingTime,
  getServingTimeText,
};
