import pull from 'lodash/pull';
import React, { PropTypes } from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Label from 'react-bootstrap/lib/Label';

class LabelSelect extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    selectedStyle: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.getValueArray = this.getValueArray.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.renderOption = this.renderOption.bind(this);
  }

  getValueArray() {
    return this.props.value === '' ? [] : this.props.value.split(',');
  }

  handleSelect(id) {
    const valueArray = this.getValueArray();
    if (valueArray.includes(id)) {
      pull(valueArray, id);
    } else {
      valueArray.push(id);
    }
    this.props.onChange(valueArray.join(','));
  }

  renderOption(option) {
    const onClick = () => this.handleSelect(option.id);
    const selected = this.getValueArray().includes(option.id);
    const extra = {};
    if (selected) {
      extra.bsStyle = this.props.selectedStyle;
    }
    return (
      <Label
        className="option"
        key={option.id}
        onClick={onClick}
        {...extra}
      >
        {option.name}
      </Label>
    );
  }

  render() {
    return (
      <FormGroup className="label-select" controlId={this.props.id}>
        <ControlLabel>{this.props.label}</ControlLabel>
        <div className="options">
          {this.props.options.map(this.renderOption)}
        </div>
      </FormGroup>
    );
  }
}

export default LabelSelect;
