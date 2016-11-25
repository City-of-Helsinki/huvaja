import React, { PropTypes } from 'react';
import moment from 'moment';
import { DateField, DatePicker as RDPDatePicker } from 'react-date-picker';

const dateFormat = 'YYYY-MM-DD';
const localizedDateFormat = 'D.M.YYYY';

function formatDate(date) {
  return moment(date, localizedDateFormat).format(dateFormat);
}

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

function DatePicker(props) {
  return (
    <DateField
      className="date-picker"
      clearIcon={false}
      collapseOnDateClick
      dateFormat={localizedDateFormat}
      footer={false}
      onChange={date => props.onChange(formatDate(date))}
      updateOnDateClick
      value={moment(props.value).format(localizedDateFormat)}
    >
      <RDPDatePicker
        highlightWeekends={false}
        weekNumbers={false}
      />
    </DateField>
  );
}

export default DatePicker;
