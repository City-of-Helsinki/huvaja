import createApiAction from './createApiAction';

function fetchComments({ cateringId, reservationId }) {
  return createApiAction({
    // TODO: Replace with correct endpoint once the backend supports it.
    endpoint: 'http://www.mocky.io/v2/58ffa5c7110000ef16f60030',
    params: { cateringId, reservationId },
    method: 'GET',
    type: 'COMMENTS',
    options: { meta: { cateringId, reservationId } },
  });
}

function createComment({ cateringId, content, userName, reservationId }) {
  const data = {
    id: Math.floor(Math.random() * 10000),
    content,
    createdAt: new Date().toISOString(),
    user: { name: userName },
  };
  return createApiAction({
    // TODO: Replace with correct endpoint once the backend supports it.
    endpoint: 'http://www.mocky.io/v2/58ffa5c7110000ef16f60030',
    body: JSON.stringify(data),
    method: 'POST',
    type: 'COMMENTS',
    options: { meta: { cateringId, data, reservationId } },
  });
}

export {  // eslint-disable-line import/prefer-default-export
  createComment,
  fetchComments,
};
