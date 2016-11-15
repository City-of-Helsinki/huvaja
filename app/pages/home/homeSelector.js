import { createStructuredSelector } from 'reselect';

function messageSelector(state) {
  return state.home.message;
}

export default createStructuredSelector({
  message: messageSelector,
});
