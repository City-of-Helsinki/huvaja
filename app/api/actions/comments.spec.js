import types from '../actionTypes';
import { createApiTest } from './testUtils';
import { fetchComments } from './comments';
import { buildAPIUrl } from './createApiAction';

describe('api/actions/comments', () => {
  describe('fetchComments', () => {
    const reservationId = 'some-reservation-id';
    createApiTest({
      name: 'fetchComments',
      action: fetchComments,
      args: [{ reservationId }],
      tests: {
        method: 'GET',
        endpoint: buildAPIUrl('comment', { reservationId }),
        request: {
          type: types.COMMENTS_GET_REQUEST,
        },
        success: {
          type: types.COMMENTS_GET_SUCCESS,
        },
        error: {
          type: types.COMMENTS_GET_ERROR,
        },
      },
    });
  });
});
