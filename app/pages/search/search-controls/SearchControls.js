import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';

class SearchControls extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = props.initialValues;
  }

  handleChange(updatedFilter) {
    this.setState(updatedFilter);
  }

  handleSearch(event) {
    event.preventDefault();
    console.log('Search with', this.state);  // eslint-disable-line no-console
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
