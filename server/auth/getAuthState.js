function getAuthState(req) {
  const user = req.user;
  if (user && user.token) {
    return {
      auth: { token: user.token, user },
    };
  }
  return {};
}

module.exports = getAuthState;
