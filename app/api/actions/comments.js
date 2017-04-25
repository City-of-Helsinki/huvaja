import createApiAction from './createApiAction';

function fetchComments({ reservationId }) {
  return createApiAction({
    endpoint: 'comment',
    params: { reservationId },
    method: 'GET',
    type: 'COMMENTS',
    options: { meta: { reservationId } },
  });
}

export {
  fetchComments,  // eslint-disable-line import/prefer-default-export
};
