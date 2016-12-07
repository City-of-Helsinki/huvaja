const sideEffects = () => dispatch => (action) => {
  const { meta = {} } = action;
  if (meta.sideEffect) {
    window.setTimeout(
      () => meta.sideEffect(action),
      0
    );
  }
  return dispatch(action);
};
export default sideEffects;
