import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import SingleAvailabilityView from 'shared/availability-view/SingleAvailabilityView';
import SelectableSingleAvailabilityView from './SelectableSingleAvailabilityView';

function getWrapper(props) {
  const defaults = {
    date: '2016-01-01',
    onDateChange: () => null,
    resource: { id: 'r-1' },
  };
  return shallow(<SelectableSingleAvailabilityView {...defaults} {...props} />);
}

describe('pages/resources/SelectableSingleAvailabilityView', () => {
  it('renders a div.selectable-availability-view', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.selectable-availability-view')).to.be.true;
  });

  it('renders a SingleAvailabilityView', () => {
    const date = '2016-10-10';
    const resource = { id: 'resource' };
    const onDateChange = () => null;
    const wrapper = getWrapper({ date, resource, onDateChange });
    const instance = wrapper.instance();
    const view = wrapper.find(SingleAvailabilityView);
    expect(view).to.have.length(1);
    expect(view.prop('date')).to.equal(date);
    expect(view.prop('resource')).to.equal(resource.id);
    expect(view.prop('onDateChange')).to.equal(onDateChange);
    expect(view.prop('onReservationSlotClick')).to.equal(instance.handleReservationSlotClick);
  });

  it('has correct initial state', () => {
    const wrapper = getWrapper();
    expect(wrapper.state()).to.deep.equal({
      mode: 'begin',
      selection: undefined,
    });
  });

  describe('componentWillReceiveProps', () => {
    function getState(props, state, nextProps) {
      const wrapper = getWrapper(props);
      wrapper.setState(state);
      wrapper.instance().componentWillReceiveProps(nextProps);
      return wrapper.state();
    }

    it('sets mode = begin if date changes', () => {
      const state = getState(
        { date: '2016-01-01' },
        { mode: 'end' },
        { date: '2016-01-02' },
      );
      expect(state.mode).to.equal('begin');
    });

    it('does not change mode if date stays the same', () => {
      const state = getState(
        { date: '2016-01-01' },
        { mode: 'end' },
        { date: '2016-01-01' },
      );
      expect(state.mode).to.equal('end');
    });
  });

  describe('handleReservationSlotClick', () => {
    function getState(props, state, slot) {
      const wrapper = getWrapper(props);
      wrapper.setState(state);
      wrapper.instance().handleReservationSlotClick(slot);
      return wrapper.state();
    }

    it('updates state if current mode is begin', () => {
      const slot = { begin: '2016-01-01T10:00:00', end: '2016-01-01T10:30:00' };
      const initialState = { mode: 'begin', selection: undefined };
      const state = getState({}, initialState, slot);
      expect(state).to.deep.equal({
        mode: 'end',
        selection: {
          begin: slot.begin,
          end: slot.end,
        },
      });
    });

    it('updates state if current mode is begin and has a selection', () => {
      const slot = { begin: '2016-01-01T10:00:00', end: '2016-01-01T10:30:00' };
      const initialState = {
        mode: 'begin',
        selection: { begin: 'foo', end: 'bar' },
      };
      const state = getState({}, initialState, slot);
      expect(state).to.deep.equal({
        mode: 'end',
        selection: {
          begin: slot.begin,
          end: slot.end,
        },
      });
    });

    it('updates state if current mode is end and slot ends after current begin', () => {
      const slot = { begin: '2016-01-01T10:00:00', end: '2016-01-01T10:30:00' };
      const initialState = {
        mode: 'end',
        selection: { begin: '2016-01-01T09:00:00', end: '2016-01-01T09:30:00' },
      };
      const state = getState({}, initialState, slot);
      expect(state).to.deep.equal({
        mode: 'begin',
        selection: {
          begin: initialState.selection.begin,
          end: slot.end,
        },
      });
    });

    it('updates state if current mode is end and same slot selected', () => {
      const slot = { begin: '2016-01-01T10:00:00', end: '2016-01-01T10:30:00' };
      const initialState = {
        mode: 'end',
        selection: { begin: '2016-01-01T10:00:00', end: '2016-01-01T10:30:00' },
      };
      const state = getState({}, initialState, slot);
      expect(state).to.deep.equal({
        mode: 'begin',
        selection: {
          begin: slot.begin,
          end: slot.end,
        },
      });
    });

    it('does not update if mode is end and slot ends at current begin', () => {
      const slot = { begin: '2016-01-01T09:30:00', end: '2016-01-01T10:00:00' };
      const initialState = {
        mode: 'end',
        selection: { begin: '2016-01-01T10:00:00', end: '2016-01-01T10:30:00' },
      };
      const state = getState({}, initialState, slot);
      expect(state).to.deep.equal(initialState);
    });

    it('does not update if mode is end and slot ends before current begin', () => {
      const slot = { begin: '2016-01-01T09:00:00', end: '2016-01-01T09:30:00' };
      const initialState = {
        mode: 'end',
        selection: { begin: '2016-01-01T10:00:00', end: '2016-01-01T10:30:00' },
      };
      const state = getState({}, initialState, slot);
      expect(state).to.deep.equal(initialState);
    });
  });
});
