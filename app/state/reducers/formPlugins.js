import { handleActions } from 'redux-actions';
import { actionTypes as formActions } from 'redux-form';

export default {
  resourceReservation: handleActions({
    [formActions.SET_SUBMIT_SUCCEEDED]: state => ({
      ...state,
      anyTouched: undefined,
      fields: undefined,
      values: {
        hostName: state.values.hostName,
        reserverName: state.values.reserverName,
        resource: state.values.resource,
      },
    }),
  }),
};
