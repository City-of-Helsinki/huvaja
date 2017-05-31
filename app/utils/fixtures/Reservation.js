import moment from 'moment';
import { Factory } from 'rosie';

const BASE_DATE = moment().add(2, 'days');

const Reservation = new Factory()
  .option('startTime', null)
  .sequence('index')
  .attr('begin', ['index', 'startTime'], (index, startTime) => (
      startTime ?
      startTime.toISOString() :
      moment(BASE_DATE).set('hour', (index + 2) % 24).toISOString()
  ))
  .attr('end', ['index', 'startTime'], (index, startTime) => (
      startTime ?
      startTime.add(1, 'hours').toISOString() :
      moment(BASE_DATE).set('hour', (index + 3) % 24).toISOString()
  ))
  .attr('resource', 'r-1');

export default Reservation;
