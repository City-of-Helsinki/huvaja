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
        time: {
          begin: {
            date: state.values.time.begin.date,
            time: null,
          },
          end: {
            date: state.values.time.end.date,
            time: null,
          },
        },
      },
    }),
  }),
};
