import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';
import Table from 'react-bootstrap/lib/Table';
import FontAwesome from 'react-fontawesome';
import simple from 'simple-mock';

import CateringOrderTable from './CateringOrderTable';

describe('shared/catering-order-table/CateringOrderTable', () => {
  function getWrapper(props) {
    const defaults = {
      items: [{
        id: 'cmi-1',
        name: { fi: 'Sokeri' },
        description: { fi: 'Tosi makee' },
        quantity: 1,
      }],
    };
    return shallow(<CateringOrderTable {...defaults} {...props} />);
  }

  it('renders a Table component', () => {
    const table = getWrapper().find(Table);
    expect(table).to.have.length(1);
  });

  describe('table header', () => {
    it('is rendered', () => {
      const thead = getWrapper().find('thead');
      expect(thead).to.have.length(1);
    });

    it('is not rendered if noHeader prop is true', () => {
      const thead = getWrapper({ noHeader: true }).find('thead');
      expect(thead).to.have.length(0);
    });

    it('has correct headers', () => {
      const ths = getWrapper().find('thead').find('th');
      expect(ths).to.have.length(3);
      expect(ths.at(0).text()).to.equal('Tuote');
      expect(ths.at(1).text()).to.equal('Kuvaus');
      expect(ths.at(2).text()).to.equal('Määrä');
    });

    describe('in narrow mode', () => {
      it('has correct headers', () => {
        const ths = getWrapper({ narrow: true }).find('thead').find('th');
        expect(ths).to.have.length(2);
        expect(ths.at(0).text()).to.equal('Tuote');
        expect(ths.at(1).text()).to.equal('Määrä');
      });
    });
  });

  describe('table body', () => {
    const items = [
      { id: 1, name: { fi: 'Kahvi' }, description: { fi: 'Maittava' }, quantity: 2 },
      { id: 2, name: { fi: 'Kokis' }, description: { fi: 'Nolla' }, quantity: 3 },
    ];

    function getTbodyWrapper(props) {
      return getWrapper({ ...props, items }).find('tbody');
    }

    it('is rendered', () => {
      const tbody = getWrapper().find('tbody');
      expect(tbody).to.have.length(1);
    });

    describe('in regular mode', () => {
      it('renders table row for every item', () => {
        const trs = getTbodyWrapper().find('tr');
        expect(trs).to.have.length(items.length);
      });

      it('renders correct table cells for each row', () => {
        const trs = getTbodyWrapper().find('tr');
        trs.forEach((tr, index) => {
          const tds = tr.find('td');
          const item = items[index];
          expect(tds).to.have.length(3);
          expect(tds.at(0).text()).to.equal(item.name.fi);
          expect(tds.at(1).text()).to.contain(item.description.fi);
          expect(tds.at(2).text()).to.contain(item.quantity);
        });
      });

      it('does not render any FormControls for editing item quantities', () => {
        const formControls = getTbodyWrapper().find(FormControl);
        expect(formControls).to.have.length(0);
      });
    });

    describe('in narrow mode', () => {
      it('renders correct table cells for each row', () => {
        const trs = getTbodyWrapper({ narrow: true }).find('tr');
        trs.forEach((tr, index) => {
          const tds = tr.find('td');
          const item = items[index];
          expect(tds).to.have.length(2);
          expect(tds.at(0).text()).to.equal(item.name.fi + item.description.fi);
          expect(tds.at(1).text()).to.contain(item.quantity);
        });
      });
    });

    describe('in edit mode', () => {
      const editOrder = simple.mock();

      it('renders table row for every item', () => {
        const trs = getTbodyWrapper({ editOrder }).find('tr');
        expect(trs).to.have.length(items.length);
      });

      it('renders correct table cells for each row', () => {
        const trs = getTbodyWrapper({ editOrder }).find('tr');
        trs.forEach((tr, index) => {
          const tds = tr.find('td');
          const item = items[index];
          expect(tds).to.have.length(4);
          expect(tds.at(0).text()).to.equal(item.name.fi);
          expect(tds.at(1).text()).to.contain(item.description.fi);
          expect(tds.at(2).find(FormControl)).to.have.length(1);
          expect(tds.at(3).find(FontAwesome)).to.have.length(1);
        });
      });

      it('renders FormControls for editing item quantities', () => {
        const trs = getTbodyWrapper({ editOrder }).find('tr');
        const mockEvent = { target: { value: 12 } };
        trs.forEach((tr, index) => {
          const formControl = tr.find(FormControl);
          const item = items[index];
          expect(formControl).to.have.length(1);
          expect(formControl.prop('value')).to.equal(item.quantity);

          editOrder.reset();
          formControl.prop('onChange')(mockEvent);
          expect(editOrder.callCount).to.equal(1);
          expect(editOrder.lastCall.args[0]).to.equal(item.id);
          expect(editOrder.lastCall.args[1]).to.equal(mockEvent.target.value);
        });
      });
    });
  });
});
