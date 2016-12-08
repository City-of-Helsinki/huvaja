import { expect } from 'chai';
import { actionTypes as formActions } from 'redux-form';

import plugins from './formPlugins';

describe('state/reducers/formPlugins', () => {
  describe('resourceReservation', () => {
    describe('SET_SUBMIT_SUCCEEDED', () => {
      const plugin = plugins.resourceReservation;
      const action = { type: formActions.SET_SUBMIT_SUCCEEDED };

      it('sets anyTouched to undefined', () => {
        const initial = { anyTouched: true, values: {} };
        const actual = plugin(initial, action);
        expect(actual.anyTouched).to.be.undefined;
      });

      it('sets fields to undefined', () => {
        const initial = { fields: { some: 'field' }, values: {} };
        const actual = plugin(initial, action);
        expect(actual.fields).to.be.undefined;
      });

      it('resets values other than reserverName and resource', () => {
        const initial = {
          values: {
            reserverName: 'Luke Skywalker',
            resource: '13',
            some: 'value',
          },
        };
        const actual = plugin(initial, action);
        expect(actual.values).to.deep.equal({ reserverName: 'Luke Skywalker', resource: '13' });
      });
    });
  });
});
