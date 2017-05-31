import React, { PropTypes } from 'react';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Row from 'react-bootstrap/lib/Row';
import NumericInput from 'react-numeric-input';
import Select from 'react-select';

import DatePicker from 'shared/date-picker';

RecurringReservationControls.propTypes = {
  changeFrequency: PropTypes.func.isRequired,
  changeLastTime: PropTypes.func.isRequired,
  changeNumberOfOccurrences: PropTypes.func.isRequired,
  frequency: PropTypes.string.isRequired,
  frequencyOptions: PropTypes.array.isRequired,
  isVisible: PropTypes.bool.isRequired,
  lastTime: PropTypes.string,
  numberOfOccurrences: PropTypes.number.isRequired,
};
function RecurringReservationControls({
  changeFrequency,
  changeLastTime,
  changeNumberOfOccurrences,
  frequency,
  frequencyOptions,
  isVisible,
  numberOfOccurrences,
  lastTime,
}) {
  if (!isVisible) {
    return <span />;
  }
  return (
    <div className="recurring-reservation-controls">
      <Row>
        <Col sm={5} xs={12}>
          <FormGroup controlId="frequencyGroup">
            <label htmlFor="recurrence-frequency-select">
              Toistuu
            </label>
            <Select
              className="recurrence-frequency-select"
              clearable={false}
              inputProps={{ id: 'recurrence-frequency-select' }}
              name="recurrence-frequency-select"
              onChange={changeFrequency}
              optionRenderer={option => option.label}
              options={frequencyOptions}
              value={frequency}
              valueRenderer={option => option.label}
            />
          </FormGroup>
        </Col>
        {frequency !== '' &&
          <Col sm={3} xs={12}>
            <FormGroup controlId="numberOfOccurrencesGroup">
              <ControlLabel>
                Toistokertoja
              </ControlLabel>
              <NumericInput
                className="form-control"
                min={1}
                onChange={changeNumberOfOccurrences}
                value={numberOfOccurrences}
              />
            </FormGroup>
          </Col>
        }
        {frequency !== '' &&
          <Col sm={4} xs={12}>
            <FormGroup controlId="LastTimeGroup">
              <ControlLabel>
                Päättyy
              </ControlLabel>
              <DatePicker
                dateFormat="D.M.YYYY"
                formControl
                onChange={changeLastTime}
                value={lastTime}
              />
            </FormGroup>
          </Col>
        }
      </Row>
    </div>
  );
}

export default RecurringReservationControls;
