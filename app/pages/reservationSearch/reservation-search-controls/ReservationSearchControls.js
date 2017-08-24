import FontAwesome from 'react-fontawesome';
import sortBy from 'lodash/sortBy';
import React, { Component, PropTypes } from 'react';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import DatePicker from 'shared/date-picker';

function getUnitOption(id, label) {
  return <option key={id} value={id}>{label}</option>;
}

function renderUnitOptions(units) {
  const defaultOption = getUnitOption('', 'Kaikki kiinteistöt');
  const optionData = Object.keys(units).map((id) => {
    const unit = units[id];
    const label = `${unit.name.fi} - ${unit.streetAddress.fi}`;
    return { id, label };
  });
  const sortedOptionData = sortBy(optionData, 'label');
  const options = sortedOptionData.map(unit => getUnitOption(unit.id, unit.label));
  return [defaultOption].concat(options);
}

function preventDefault(event) {
  event.preventDefault();
}

class ReservationSearchControls extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    values: PropTypes.shape({
      end: PropTypes.string.isRequired,
      eventSubject: PropTypes.string.isRequired,
      hasCateringOrder: PropTypes.string.isRequired,
      hostName: PropTypes.string.isRequired,
      isFavoriteResource: PropTypes.string.isRequired,
      isOwn: PropTypes.string.isRequired,
      reserverName: PropTypes.string.isRequired,
      resourceName: PropTypes.string.isRequired,
      start: PropTypes.string.isRequired,
      unit: PropTypes.string.isRequired,
    }).isRequired,
    units: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(updatedFilter) {
    this.props.onChange(updatedFilter);
  }

  render() {
    return (
      <div className="reservation-search-controls">
        <form onSubmit={preventDefault}>
          <Row>
            <Col md={4}>
              <FormGroup controlId="event-subject-control-group">
                <ControlLabel>Hae varauksen nimellä</ControlLabel>
                <FormControl
                  onChange={event => this.handleChange({ eventSubject: event.target.value })}
                  type="text"
                  value={this.props.values.eventSubject}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup controlId="host-name-control-group">
                <ControlLabel>Varauksen isäntä</ControlLabel>
                <FormControl
                  onChange={event => this.handleChange({ hostName: event.target.value })}
                  type="text"
                  value={this.props.values.hostName}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <Checkbox
                className="is-own-checkbox"
                onChange={event =>
                  this.handleChange({ isOwn: event.target.checked ? 'true' : '' })
                }
                checked={this.props.values.isOwn === 'true'}
              >
                Näytä vain omat varaukset
              </Checkbox>
              <Checkbox
                className="has-catering-checkbox"
                onChange={event =>
                  this.handleChange({ hasCateringOrder: event.target.checked ? 'true' : '' })
                }
                checked={this.props.values.hasCateringOrder === 'true'}
              >
                Sisältää tarjoilutilauksen
              </Checkbox>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup controlId="dates-control-group">
                <ControlLabel>Varaukset aikavälillä</ControlLabel>
                <div className="date-pickers-container">
                  <DatePicker
                    onChange={start => this.handleChange({ start })}
                    value={this.props.values.start}
                  />
                  <div className="delimiter">
                    <FontAwesome name="caret-right" />
                  </div>
                  <DatePicker
                    onChange={end => this.handleChange({ end })}
                    value={this.props.values.end}
                  />
                </div>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup controlId="reserver-name-control-group">
                <ControlLabel>Varaaja</ControlLabel>
                <FormControl
                  onChange={event => this.handleChange({ reserverName: event.target.value })}
                  type="text"
                  value={this.props.values.reserverName}
                />
              </FormGroup>
            </Col>
          </Row>
          <hr className="separator" />
          <Row>
            <Col md={4}>
              <FormGroup controlId="unit-control-group">
                <ControlLabel>Kiinteistö</ControlLabel>
                <div className="select">
                  <FormControl
                    componentClass="select"
                    onChange={event => this.handleChange({ unit: event.target.value })}
                    type="select"
                    value={this.props.values.unit}
                  >
                    {renderUnitOptions(this.props.units)}
                  </FormControl>
                </div>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup controlId="resource-name-control-group">
                <ControlLabel>Tilan nimi</ControlLabel>
                <FormControl
                  onChange={event => this.handleChange({ resourceName: event.target.value })}
                  type="text"
                  value={this.props.values.resourceName}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <Checkbox
                className="is-favorite-resource-checkbox"
                onChange={event =>
                  this.handleChange({ isFavoriteResource: event.target.checked ? 'true' : '' })
                }
                checked={this.props.values.isFavoriteResource === 'true'}
              >
                Näytä vain omat suosikkitilat
              </Checkbox>
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

export default ReservationSearchControls;
