import types from '../actionTypes';
import { createApiTest } from './testUtils';
import { fetchReservationDetailsReport, fetchResourceDailyReport } from './reports';
import { buildUrl } from './utils';

describe('api/actions/reports', () => {
  createApiTest({
    name: 'fetchResourceDailyReport',
    action: fetchResourceDailyReport,
    args: [{ date: '2017-02-18', resourceIds: ['abc', 'def'] }],
    tests: {
      method: 'GET',
      endpoint: buildUrl(
        SETTINGS.REPORT_URL,
        'daily_reservations',
        {
          day: '2017-02-18',
          include_resources_without_reservations: 'true',
          resource: 'abc,def',
        }
      ),
      request: {
        type: types.RESOURCE_DAILY_REPORT_GET_REQUEST,
      },
      success: {
        type: types.RESOURCE_DAILY_REPORT_GET_SUCCESS,
      },
      error: {
        type: types.RESOURCE_DAILY_REPORT_GET_ERROR,
      },
    },
  });

  createApiTest({
    name: 'fetchReservationDetailsReport',
    action: fetchReservationDetailsReport,
    args: [123],
    tests: {
      method: 'GET',
      endpoint: buildUrl(
        SETTINGS.REPORT_URL,
        'reservation_details',
        {
          reservation: 123,
        }
      ),
      request: {
        type: types.RESERVATION_DETAILS_REPORT_GET_REQUEST,
      },
      success: {
        type: types.RESERVATION_DETAILS_REPORT_GET_SUCCESS,
      },
      error: {
        type: types.RESERVATION_DETAILS_REPORT_GET_ERROR,
      },
    },
  });
});
