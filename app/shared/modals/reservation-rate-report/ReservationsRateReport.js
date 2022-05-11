import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import Row from 'react-bootstrap/lib/Row';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import { Typeahead } from 'react-bootstrap-typeahead';

import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import DatePicker from 'shared/date-picker';
import DateTimeRange from 'shared/form-fields/DateTimeRange';
import { fetchReservationsRateReport } from 'api/actions';
import uiActions from 'actions/uiActions';
import Selector from './ReservationsRateReportSelector';

export class ReservationsRateReportModal extends Component {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    units: PropTypes.object.isRequired,
    fetchReservationsRateReport: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired,
    filters: PropTypes.shape({
      unitSelections: PropTypes.array.isRequired,
      times: PropTypes.object.isRequired,
      dateStart: PropTypes.string.isRequired,
      dateEnd: PropTypes.string.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.downloadReport = this.downloadReport.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(filter) {
    this.props.onChange(filter);
  }

  downloadReport() {
    const {
      unitSelections,
      dateStart,
      dateEnd,
      times,
    } = this.props.filters;

    this.props.fetchReservationsRateReport({
      start_date: dateStart,
      end_date: dateEnd,
      start_time: times.begin.time,
      end_time: times.end.time,
      units: unitSelections.map(selection => selection.value),
    });
  }

  render() {
    const {
      onHide,
      show,
      units,
      loading,
      errorMessage,
    } = this.props;

    const {
      dateStart,
      dateEnd,
      times,
    } = this.props.filters;

    const unitOptions = Object.keys(units).map((id) => {
      const unit = units[id];
      return {
        value: unit.id,
        label: `${unit.name.fi} - ${unit.streetAddress.fi}`,
      };
    });

    return (
      <Modal
        onHide={onHide}
        show={show}
      >
        <div className="reservations-rate-report-modal">
          <Modal.Header closeButton>
            <h2 className="modal-title">Varausasteraportti</h2>
          </Modal.Header>
          <Modal.Body>
            <div className="modal-body">
              <Row>
                <FormGroup controlId="unit-select-control-group">
                  <Typeahead
                    multiple
                    options={unitOptions}
                    placeholder="Valitse kiinteistö"
                    id="unit-multi-select"
                    onChange={selected => this.handleChange({ unitSelections: selected })}
                    className="unit-multi-select"
                  />
                </FormGroup>
              </Row>
              <Row>
                <FormGroup controlId="dates-control-group">
                  <div className="date-pickers-container">
                    <ControlLabel>Varaukset aikavälillä</ControlLabel>
                    <DatePicker
                      onChange={start => this.handleChange({ dateStart: start })}
                      value={dateStart}
                      className="date-picker-field"
                    />
                    <div className="delimiter">
                      <FontAwesome name="caret-right" />
                    </div>
                    <DatePicker
                      onChange={end => this.handleChange({ dateEnd: end })}
                      value={dateEnd}
                      className="date-picker-field"
                    />
                  </div>
                </FormGroup>
              </Row>
              <Row>
                <FormGroup controlId="time-picker-control-group">
                  <div className="time-picker-container">
                    <DateTimeRange
                      id="reservation-time-range"
                      className="reservation-time-range"
                      controlProps={{
                        renderDatePicker: false,
                        onChange: time => this.handleChange({ times: time }),
                        value: times,
                      }}
                    />
                  </div>
                </FormGroup>
              </Row>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="download-button"
              onClick={this.downloadReport}
              bsStyle="primary"
              disabled={loading}
            >
              Lataa
            </Button>
            <span style={{ color: 'red' }}>{ errorMessage }</span>
          </Modal.Footer>
        </div>
      </Modal>
    );
  }
}

const actions = {
  onHide: uiActions.hideReservationsRateReportModal,
  onChange: uiActions.changeReservationsRateReportModalFilters,
  fetchReservationsRateReport,
};

export default connect(Selector, actions)(
  ReservationsRateReportModal
);
