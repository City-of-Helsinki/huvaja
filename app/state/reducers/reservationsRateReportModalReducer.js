import moment from 'moment';
import { handleActions } from 'redux-actions';

import uiActions from 'actions/uiActions';
import actionTypes from 'api/actionTypes';

const initialState = {
  units: [],
  show: false,
  loading: false,
  errorMessage: '',
  filters: {
    unitSelections: [],
    dateStart: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    dateEnd: moment().format('YYYY-MM-DD'),
    times: {
      begin: { time: '08:00' },
      end: { time: '16:00' },
    },
  },
};

const hide = () => initialState;

const show = state => ({
  ...state,
  show: true,
});

export default handleActions({
  [uiActions.showReservationsRateReportModal]: show,
  [uiActions.hideReservationsRateReportModal]: hide,
  [uiActions.changeReservationsRateReportModalFilters]: (state, action) => ({
    ...state,
    filters: {
      ...state.filters,
      ...action.payload,
    },
  }),
  [actionTypes.RESERVATIONS_RATE_REPORT_GET_REQUEST]: state => ({
    ...state,
    loading: true,
  }),
  [actionTypes.RESERVATIONS_RATE_REPORT_GET_ERROR]: (state, action) => ({
    ...state,
    errorMessage: action.payload.response[0],
    loading: false,
  }),
  [actionTypes.RESERVATIONS_RATE_REPORT_GET_SUCCESS]: state => ({
    ...state,
    errorMessage: '',
    loading: false,
  }),
}, initialState);
