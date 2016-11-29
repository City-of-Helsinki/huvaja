function getAuthState(req) {
  const user = req.user;
  if (user && user.id && user.token) {
    return {
      auth: { userId: user.id, token: user.token },
      data: {
        users: {
          [user.id]: user,
        },
      },
    };
  }
  return {};
}

module.exports = getAuthState;
