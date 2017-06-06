import { createApiAction } from './utils';

function fetchComments({ cateringId, reservationId }) {
  const targetType = cateringId ? 'catering' : 'reservation';
  const targetId = cateringId || reservationId;
  return createApiAction({
    endpoint: 'comment',
    params: { targetType, targetId },
    method: 'GET',
    type: 'COMMENTS',
    options: { meta: { targetType, targetId } },
  });
}

function createComment({ cateringId, text, reservationId }) {
  const targetType = cateringId ? 'catering' : 'reservation';
  const targetId = cateringId || reservationId;
  const data = {
    text,
    target_type: targetType,
    target_id: targetId,
  };
  return createApiAction({
    endpoint: 'comment',
    body: JSON.stringify(data),
    method: 'POST',
    type: 'COMMENTS',
    options: { meta: { targetType, targetId } },
  });
}

export {  // eslint-disable-line import/prefer-default-export
  createComment,
  fetchComments,
};
