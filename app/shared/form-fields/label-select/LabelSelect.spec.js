import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Label from 'react-bootstrap/lib/Label';
import simple from 'simple-mock';

import LabelSelect from './LabelSelect';

describe('shared/form-fields/label-select/LabelSelect', () => {
  const defaults = {
    id: 'equipment-control-group',
    options: [
      { id: '123', name: 'Videoprojektori' },
      { id: '124', name: 'Televisio' },
      { id: '125', name: 'Valkokangas' },
    ],
    label: 'Tilan varustelut',
    onChange: () => null,
    selectedStyle: 'primary',
    value: '123,125',
  };

  function getWrapper(props) {
    return shallow(<LabelSelect {...defaults} {...props} />);
  }

  describe('render', () => {
    it('renders FormGroup with id', () => {
      const wrapper = getWrapper();
      expect(wrapper.is(FormGroup)).to.be.true;
      expect(wrapper.prop('controlId')).to.equal(defaults.id);
    });

    it('renders label', () => {
      const label = getWrapper().find(ControlLabel);
      expect(label.children().text()).to.equal(defaults.label);
    });

    describe('options', () => {
      it('are rendered', () => {
        const options = getWrapper().find(Label);
        expect(options).to.have.length(3);
        expect(options.at(0).children().text()).to.equal(defaults.options[0].name);
        expect(options.at(1).children().text()).to.equal(defaults.options[1].name);
        expect(options.at(2).children().text()).to.equal(defaults.options[2].name);
      });

      it('have correct selected styles', () => {
        const options = getWrapper().find(Label);
        expect(options.at(0).prop('bsStyle')).to.equal(defaults.selectedStyle);
        expect(options.at(1).prop('bsStyle')).to.equal('default');
        expect(options.at(2).prop('bsStyle')).to.equal(defaults.selectedStyle);
      });
    });
  });

  describe('handleSelect', () => {
    it('adds id if not selected', () => {
      const onChange = simple.mock();
      const instance = getWrapper({ onChange }).instance();
      instance.handleSelect('124');
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.arg).to.equal('123,125,124');
    });

    it('removes id if selected', () => {
      const onChange = simple.mock();
      const instance = getWrapper({ onChange }).instance();
      instance.handleSelect('123');
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.arg).to.equal('125');
    });

    it('adds first id correctly', () => {
      const onChange = simple.mock();
      const instance = getWrapper({ onChange, value: '' }).instance();
      instance.handleSelect('124');
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.arg).to.equal('124');
    });
  });
});
