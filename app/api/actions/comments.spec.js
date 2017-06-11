import types from '../actionTypes';
import { createApiTest } from './testUtils';
import { createComment, fetchComments } from './comments';
import { buildAPIUrl } from './utils';

describe('api/actions/comments', () => {
  describe('fetchComments', () => {
    const cateringId = 85559;
    const reservationId = 3819;

    createApiTest({
      name: 'fetchComments(reservationId)',
      action: fetchComments,
      args: [{ reservationId }],
      tests: {
        method: 'GET',
        endpoint: buildAPIUrl('comment', { targetType: 'reservation', targetId: reservationId }),
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

    createApiTest({
      name: 'fetchComments(cateringId)',
      action: fetchComments,
      args: [{ cateringId }],
      tests: {
        method: 'GET',
        endpoint: buildAPIUrl('comment', { targetType: 'catering_order', targetId: cateringId }),
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

  describe('createComment', () => {
    const cateringId = 4942;
    const reservationId = 3819;
    const text = 'Commends are comments';
    const userName = 'Conrad Commentor';

    createApiTest({
      name: 'createComment(reservationId)',
      action: createComment,
      args: [{ reservationId, text, userName }],
      tests: {
        method: 'POST',
        endpoint: buildAPIUrl('comment'),
        body: {
          text,
          target_type: 'reservation',
          target_id: reservationId,
        },
        request: {
          type: types.COMMENTS_POST_REQUEST,
        },
        success: {
          type: types.COMMENTS_POST_SUCCESS,
        },
        error: {
          type: types.COMMENTS_POST_ERROR,
        },
      },
    });

    createApiTest({
      name: 'createComment(cateringId)',
      action: createComment,
      args: [{ cateringId, text, userName }],
      tests: {
        method: 'POST',
        endpoint: buildAPIUrl('comment'),
        body: {
          text,
          target_type: 'catering_order',
          target_id: cateringId,
        },
        request: {
          type: types.COMMENTS_POST_REQUEST,
        },
        success: {
          type: types.COMMENTS_POST_SUCCESS,
        },
        error: {
          type: types.COMMENTS_POST_ERROR,
        },
      },
    });
  });
});
