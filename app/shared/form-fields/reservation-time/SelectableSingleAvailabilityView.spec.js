import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import SingleAvailabilityView from 'shared/availability-view/SingleAvailabilityView';
import SelectableSingleAvailabilityView from './SelectableSingleAvailabilityView';

function getWrapper(props) {
  const defaults = {
    date: '2016-01-01',
    hideDateSelector: true,
    onChange: () => null,
    onDateChange: () => null,
    onDateSelection: () => null,
    resource: { id: 'r-1' },
    value: {
      begin: { date: '2016-01-01', time: null },
      end: { date: '2016-01-01', time: null },
    },
  };
  return shallow(<SelectableSingleAvailabilityView {...defaults} {...props} />);
}

describe('pages/resources/SelectableSingleAvailabilityView', () => {
  afterEach(() => {
    simple.restore();
  });

  it('renders a div.selectable-availability-view', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.selectable-availability-view')).to.be.true;
  });

  it('renders a SingleAvailabilityView', () => {
    const date = '2016-10-10';
    const hideDateSelector = true;
    const resource = { id: 'resource' };
    const onDateChange = () => null;
    const wrapper = getWrapper({ date, resource, onDateChange });
    const instance = wrapper.instance();
    const view = wrapper.find(SingleAvailabilityView);
    expect(view).to.have.length(1);
    expect(view.prop('date')).to.equal(date);
    expect(view.prop('hideDateSelector')).to.equal(hideDateSelector);
    expect(view.prop('resource')).to.equal(resource.id);
    expect(view.prop('onDateChange')).to.equal(onDateChange);
    expect(view.prop('onReservationSlotMouseDown')).to.equal(
      instance.handleReservationSlotMouseDown
    );
    expect(view.prop('onReservationSlotMouseEnter')).to.equal(
      instance.handleReservationSlotMouseEnter
    );
    expect(view.prop('onReservationSlotMouseUp')).to.equal(
      instance.handleReservationSlotMouseUp
    );
  });

  it('has correct initial state', () => {
    const wrapper = getWrapper();
    expect(wrapper.state()).to.deep.equal({ isSelecting: false, selection: null });
  });

  describe('handleReservationSlotMouseDown', () => {
    function handleMouseDown(slot, onChange = () => null) {
      const wrapper = getWrapper({ onChange });
      wrapper.instance().handleReservationSlotMouseDown(slot);
      return wrapper;
    }

    it('updates state', () => {
      const slot = { begin: '2017-01-01T10:00:00', end: '2017-01-01T10:30:00' };
      const wrapper = handleMouseDown(slot);
      expect(wrapper.state()).to.deep.equal({ isSelecting: true, selection: slot });
    });

    it('calls props.onChange', () => {
      const onChange = simple.mock();
      const slot = { begin: '2017-01-01T10:00:00', end: '2017-01-01T10:30:00' };
      handleMouseDown(slot, onChange);
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args).to.deep.equal([{
        begin: { date: '2017-01-01', time: '10:00' },
        end: { date: '2017-01-01', time: '10:30' },
      }]);
    });
  });

  describe('handleReservationSlotMouseUp', () => {
    function handleMouseUp(props) {
      const wrapper = getWrapper(props);
      wrapper.instance().handleReservationSlotMouseUp();
      return wrapper;
    }

    it('updates state', () => {
      const wrapper = handleMouseUp();
      expect(wrapper.state()).to.deep.equal({ isSelecting: false, selection: null });
    });

    it('does not call props.onChange', () => {
      const onChange = simple.mock();
      handleMouseUp({ onChange });
      expect(onChange.called).to.be.false;
    });

    it('calls props.onDateSelection', () => {
      const onDateSelection = simple.mock();
      handleMouseUp({ onDateSelection });
      expect(onDateSelection.callCount).to.equal(1);
    });
  });

  describe('handleReservationSlotMouseEnter', () => {
    function handleMouseEnter({ slot, state, onChange = () => null }) {
      const wrapper = getWrapper({ onChange });
      if (state) {
        wrapper.setState(state);
      }
      wrapper.instance().handleReservationSlotMouseEnter(slot);
      return wrapper;
    }

    describe('when not selecting', () => {
      it('does not update state', () => {
        const state = { isSelecting: false, selection: null };
        const slot = {};
        const wrapper = handleMouseEnter({ slot, state });
        expect(wrapper.state()).to.deep.equal(state);
      });

      it('does not call props.onChange', () => {
        const state = { isSelecting: false, selection: null };
        const slot = {};
        const onChange = simple.mock();
        handleMouseEnter({ slot, state, onChange });
        expect(onChange.called).to.be.false;
      });
    });

    describe('when selecting', () => {
      it('does not update state', () => {
        const selection = { begin: '2017-01-01T10:00:00', end: '2017-01-01T10:30:00' };
        const state = { isSelecting: true, selection };
        const slot = { begin: '2017-01-01T10:30:00', end: '2017-01-01T11:00:00' };
        const wrapper = handleMouseEnter({ slot, state });
        expect(wrapper.state()).to.deep.equal(state);
      });

      it('calls props.onChange when slot is after start slot', () => {
        const selection = { begin: '2017-01-01T10:00:00', end: '2017-01-01T10:30:00' };
        const state = { isSelecting: true, selection };
        const slot = { begin: '2017-01-01T10:30:00', end: '2017-01-01T11:00:00' };
        const onChange = simple.mock();
        handleMouseEnter({ slot, state, onChange });
        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.args).to.deep.equal([{
          begin: { date: '2017-01-01', time: '10:00' },
          end: { date: '2017-01-01', time: '11:00' },
        }]);
      });

      it('calls props.onChange when slot is before start slot', () => {
        const selection = { begin: '2017-01-01T10:00:00', end: '2017-01-01T10:30:00' };
        const state = { isSelecting: true, selection };
        const slot = { begin: '2017-01-01T08:30:00', end: '2017-01-01T09:00:00' };
        const onChange = simple.mock();
        handleMouseEnter({ slot, state, onChange });
        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.args).to.deep.equal([{
          begin: { date: '2017-01-01', time: '08:30' },
          end: { date: '2017-01-01', time: '10:30' },
        }]);
      });
    });
  });
});
