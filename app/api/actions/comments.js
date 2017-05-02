import createApiAction from './createApiAction';

const mockUrl = 'https://mockbin.org/bin/377913d3-940a-49a0-8d52-ad6edd56986b';

function fetchComments({ cateringId, reservationId }) {
  return createApiAction({
    // TODO: Replace with correct endpoint once the backend supports it.
    endpoint: mockUrl,
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
    endpoint: mockUrl,
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
