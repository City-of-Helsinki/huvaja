import { decamelizeKeys } from 'humps';
import isEqual from 'lodash/isEqual';
import queryString from 'query-string';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import { browserHistory } from 'react-router';

import DatePicker from 'shared/date-picker';

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
    initialValues: PropTypes.shape({
      date: PropTypes.string.isRequired,
      isFavorite: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired,
      unit: PropTypes.string.isRequired,
    }).isRequired,
    units: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = props.initialValues;
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.state, nextProps.initialValues)) {
      this.setState(nextProps.initialValues);
    }
  }

  handleChange(updatedFilter) {
    this.setState(updatedFilter);
  }

  handleSearch(event) {
    event.preventDefault();
    const filters = decamelizeKeys(this.state);
    browserHistory.push(`/?${queryString.stringify(filters)}`);
  }

  render() {
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
          <FormGroup className="date-control-group" controlId="date-control-group">
            <ControlLabel>Päivä</ControlLabel>
            <DatePicker
              onChange={date => this.handleChange({ date })}
              value={this.state.date}
            />
          </FormGroup>
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
