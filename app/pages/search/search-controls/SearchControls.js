import isEqual from 'lodash/isEqual';
import queryString from 'query-string';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import { browserHistory } from 'react-router';

class SearchControls extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = props.initialValues;
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.initialValues, nextProps.initialValues)) {
      this.setState(nextProps.initialValues);
    }
  }

  handleChange(updatedFilter) {
    this.setState(updatedFilter);
  }

  handleSearch(event) {
    event.preventDefault();
    browserHistory.push(`/?${queryString.stringify(this.state)}`);
  }

  render() {
    return (
      <div className="search-controls">
        <form onSubmit={this.handleSearch}>
          <FormGroup controlId="search-query">
            <ControlLabel>Tekstihaku</ControlLabel>
            <FormControl
              autoFocus
              onChange={event => this.handleChange({ query: event.target.value })}
              placeholder="Hae tilan nimellä, osoitteella..."
              type="text"
              value={this.state.query}
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

SearchControls.propTypes = {
  initialValues: PropTypes.shape({
    query: PropTypes.string.isRequired,
  }).isRequired,
};

export default SearchControls;
