import { expect } from 'chai';
import { actionTypes as formActions } from 'redux-form';

import plugins from './formPlugins';

describe('state/reducers/formPlugins', () => {
  describe('resourceReservation', () => {
    describe('SET_SUBMIT_SUCCEEDED', () => {
      const plugin = plugins.resourceReservation;
      const action = { type: formActions.SET_SUBMIT_SUCCEEDED };
      const time = {
        begin: { date: '2017-01-01', time: null },
        end: { date: '2017-01-01', time: null },
      };

      it('sets anyTouched to undefined', () => {
        const initial = { anyTouched: true, values: { time } };
        const actual = plugin(initial, action);
        expect(actual.anyTouched).to.be.undefined;
      });

      it('sets fields to undefined', () => {
        const initial = { fields: { some: 'field' }, values: { time } };
        const actual = plugin(initial, action);
        expect(actual.fields).to.be.undefined;
      });

      it('resets values other than hostName, reserverName and resource', () => {
        const initial = {
          values: {
            hostName: 'Luke Skywalker',
            reserverName: 'Luke Skywalker',
            resource: '13',
            time,
            some: 'value',
          },
        };
        const expectedValues = {
          hostName: 'Luke Skywalker',
          reserverName: 'Luke Skywalker',
          resource: '13',
          time,
        };
        const actual = plugin(initial, action);
        expect(actual.values).to.deep.equal(expectedValues);
      });

      it('resets time but not date', () => {
        const date = '2017-01-01';
        const initial = {
          values: {
            time: {
              begin: { date, time: '10:00' },
              end: { date, time: '12:00' },
            },
          },
        };
        const actual = plugin(initial, action);
        expect(actual.values.time).to.deep.equal({
          begin: { date, time: null },
          end: { date, time: null },
        });
      });
    });
  });
});
