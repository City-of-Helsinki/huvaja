import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';
import { browserHistory } from 'react-router';
import simple from 'simple-mock';

import SingleAvailabilityView from 'shared/availability-view/SingleAvailabilityView';
import SelectableSingleAvailabilityView from './SelectableSingleAvailabilityView';

function getWrapper(props) {
  const defaults = {
    date: '2016-01-01',
    onChange: () => null,
    onDateChange: () => null,
    resource: { id: 'r-1' },
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

  it('has correct initial state if query.begin is a date', () => {
    simple.mock(browserHistory, 'getCurrentLocation', () => ({
      query: { begin: '2016-01-01' },
    }));
    const wrapper = getWrapper();
    expect(wrapper.state()).to.deep.equal({
      mode: 'begin',
      selection: undefined,
    });
  });

  it('has correct initial state if query.begin is a datetime', () => {
    simple.mock(browserHistory, 'getCurrentLocation', () => ({
      query: { begin: '2016-01-01T10:00:00' },
    }));
    const wrapper = getWrapper();
    expect(wrapper.state()).to.deep.equal({
      mode: 'end',
      selection: {
        begin: '2016-01-01T10:00:00',
        end: moment('2016-01-01T10:30:00').format(),
      },
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

    it('sets mode = begin if value changes to ""', () => {
      const state = getState(
        { date: '2016-01-01', value: { begin: '', end: '' } },
        { mode: 'end' },
        { date: '2016-01-01', value: '' },
      );
      expect(state.mode).to.equal('begin');
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
      const onChange = simple.mock();
      const slot = { begin: '2016-01-01T10:00:00', end: '2016-01-01T10:30:00' };
      const initialState = { mode: 'begin', selection: undefined };
      const state = getState({ onChange }, initialState, slot);
      const selection = { begin: slot.begin, end: slot.end };
      expect(state).to.deep.equal({ mode: 'end', selection });
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args).to.deep.equal([selection]);
    });

    it('updates state if current mode is begin and has a selection', () => {
      const onChange = simple.mock();
      const slot = { begin: '2016-01-01T10:00:00', end: '2016-01-01T10:30:00' };
      const initialState = {
        mode: 'begin',
        selection: { begin: 'foo', end: 'bar' },
      };
      const state = getState({ onChange }, initialState, slot);
      const selection = { begin: slot.begin, end: slot.end };
      expect(state).to.deep.equal({ mode: 'end', selection });
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args).to.deep.equal([selection]);
    });

    it('updates state if current mode is end and slot ends after current begin', () => {
      const onChange = simple.mock();
      const slot = { begin: '2016-01-01T10:00:00', end: '2016-01-01T10:30:00' };
      const initialState = {
        mode: 'end',
        selection: { begin: '2016-01-01T09:00:00', end: '2016-01-01T09:30:00' },
      };
      const state = getState({ onChange }, initialState, slot);
      const selection = { begin: initialState.selection.begin, end: slot.end };
      expect(state).to.deep.equal({ mode: 'begin', selection });
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args).to.deep.equal([selection]);
    });

    it('updates state if current mode is end and same slot selected', () => {
      const onChange = simple.mock();
      const slot = { begin: '2016-01-01T10:00:00', end: '2016-01-01T10:30:00' };
      const initialState = {
        mode: 'end',
        selection: { begin: '2016-01-01T10:00:00', end: '2016-01-01T10:30:00' },
      };
      const state = getState({ onChange }, initialState, slot);
      const selection = { begin: slot.begin, end: slot.end };
      expect(state).to.deep.equal({ mode: 'begin', selection });
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args).to.deep.equal([selection]);
    });

    it('does not update if mode is end and slot ends at current begin', () => {
      const onChange = simple.mock();
      const slot = { begin: '2016-01-01T09:30:00', end: '2016-01-01T10:00:00' };
      const initialState = {
        mode: 'end',
        selection: { begin: '2016-01-01T10:00:00', end: '2016-01-01T10:30:00' },
      };
      const state = getState({ onChange }, initialState, slot);
      expect(state).to.deep.equal(initialState);
      expect(onChange.called).to.be.false;
    });

    it('does not update if mode is end and slot ends before current begin', () => {
      const onChange = simple.mock();
      const slot = { begin: '2016-01-01T09:00:00', end: '2016-01-01T09:30:00' };
      const initialState = {
        mode: 'end',
        selection: { begin: '2016-01-01T10:00:00', end: '2016-01-01T10:30:00' },
      };
      const state = getState({ onChange }, initialState, slot);
      expect(state).to.deep.equal(initialState);
      expect(onChange.called).to.be.false;
    });
  });
});
