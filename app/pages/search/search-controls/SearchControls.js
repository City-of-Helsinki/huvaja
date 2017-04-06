import FontAwesome from 'react-fontawesome';
import { decamelizeKeys } from 'humps';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import queryString from 'query-string';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import { browserHistory } from 'react-router';

import DatePicker from 'shared/date-picker';
import LabelSelect from 'shared/form-fields/label-select/LabelSelect';

function getUnitOption(id, name) {
  return <option key={id} value={id}>{name}</option>;
}

function renderUnitOptions(units) {
  const defaultOption = getUnitOption('', 'Kaikki kiinteistöt');
  const options = Object.keys(units).map(id =>
    getUnitOption(id, units[id].name.fi)
  );
  return [defaultOption].concat(options);
}

class SearchControls extends Component {
  static propTypes = {
    equipment: PropTypes.object.isRequired,
    initialValues: PropTypes.shape({
      date: PropTypes.string.isRequired,
      isFavorite: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      unit: PropTypes.string.isRequired,
    }).isRequired,
    types: PropTypes.object.isRequired,
    units: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.toggleAdvanced = this.toggleAdvanced.bind(this);
    this.state = {
      showAdvanced: false,
      ...props.initialValues,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.state, nextProps.initialValues)) {
      this.setState(nextProps.initialValues);
    }
  }

  getEquipmentOptions() {
    return Object.keys(this.props.equipment).map(id => (
      { id, name: this.props.equipment[id].name.fi }
    ));
  }

  getTypeOptions() {
    return Object.keys(this.props.types).map(id => (
      { id, name: this.props.types[id].name.fi }
    ));
  }

  handleChange(updatedFilter) {
    this.setState(updatedFilter);
  }

  handleSearch(event) {
    event.preventDefault();
    const filters = decamelizeKeys(
      omit(this.state, ['showAdvanced'])
    );
    browserHistory.push(`/?${queryString.stringify(filters)}`);
  }

  toggleAdvanced() {
    this.setState({ showAdvanced: !this.state.showAdvanced });
  }

  renderAdvanced() {
    return (
      <div>
        <FormGroup className="date-control-group" controlId="date-control-group">
          <ControlLabel>Päivä</ControlLabel>
          <DatePicker
            onChange={date => this.handleChange({ date })}
            value={this.state.date}
          />
        </FormGroup>
        <FormGroup controlId="people-control-group">
          <ControlLabel>Paikkoja vähintään</ControlLabel>
          <FormControl
            min="0"
            onChange={event => this.handleChange({ people: event.target.value })}
            type="number"
            value={this.state.people}
          />
        </FormGroup>
        <LabelSelect
          id="equipment-control-group"
          label="Saatavilla olevat varusteet"
          onChange={value => this.handleChange({ equipment: value })}
          options={this.getEquipmentOptions()}
          selectedStyle="success"
          value={this.state.equipment}
        />
        <LabelSelect
          id="type-control-group"
          label="Tilan tyyppi"
          onChange={value => this.handleChange({ type: value })}
          options={this.getTypeOptions()}
          selectedStyle="primary"
          value={this.state.type}
        />
      </div>
    );
  }

  render() {
    const advancedIconName = this.state.showAdvanced ? 'caret-down' : 'caret-right';
    return (
      <div className="search-controls">
        <form onSubmit={this.handleSearch}>
          <FormGroup controlId="unit-control-group">
            <ControlLabel>Kiinteistö</ControlLabel>
            <FormControl
              componentClass="select"
              onChange={event => this.handleChange({ unit: event.target.value })}
              type="select"
              value={this.state.unit}
            >
              {renderUnitOptions(this.props.units)}
            </FormControl>
          </FormGroup>
          <FormGroup controlId="search-control-group">
            <ControlLabel>Tilan nimi</ControlLabel>
            <FormControl
              autoFocus
              onChange={event => this.handleChange({ search: event.target.value })}
              type="text"
              value={this.state.search}
            />
          </FormGroup>
          <Checkbox
            className="is-favorite-checkbox"
            onChange={event =>
              this.handleChange({ isFavorite: event.target.checked ? 'true' : '' })
            }
            checked={this.state.isFavorite === 'true'}
          >
            Näytä vain omat suosikit
          </Checkbox>
          <div className="toggle-container">
            <a className="toggle-advanced" onClick={this.toggleAdvanced} tabIndex="0">
              Tarkemmat rajaukset <FontAwesome className="icon" name={advancedIconName} />
            </a>
          </div>
          {this.state.showAdvanced ? this.renderAdvanced() : null}
          <Button
            block
            bsStyle="primary"
            className="search-button"
            type="submit"
          >
            Hae
          </Button>
        </form>
      </div>
    );
  }
}

export default SearchControls;
