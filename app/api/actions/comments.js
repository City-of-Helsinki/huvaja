import createApiAction from './createApiAction';

function fetchComments({ reservationId }) {
  return createApiAction({
    // TODO: Replace with correct endpoint once the backend supports it.
    endpoint: 'http://www.mocky.io/v2/58ffa5c7110000ef16f60030',
    params: { reservationId },
    method: 'GET',
    type: 'COMMENTS',
    options: { meta: { reservationId } },
  });
}

export {
  fetchComments,  // eslint-disable-line import/prefer-default-export
};
