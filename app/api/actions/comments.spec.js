import types from '../actionTypes';
import { createApiTest } from './testUtils';
import { fetchComments } from './comments';

describe('api/actions/comments', () => {
  describe('fetchComments', () => {
    const reservationId = 3819;
    createApiTest({
      name: 'fetchComments',
      action: fetchComments,
      args: [{ reservationId }],
      tests: {
        method: 'GET',
        endpoint: `http://www.mocky.io/v2/58ffa5c7110000ef16f60030?reservation_id=${reservationId}`,
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
