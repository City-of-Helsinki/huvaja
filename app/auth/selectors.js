const currentUserSelector = (state) => {
  const user = state.auth.user;
  if (!user) {
    return null;
  }
  const { emails, firstName, lastName, username } = user;
  const email = emails && emails.length ? emails[0].value : '';
  const name = firstName || lastName ? `${firstName} ${lastName}` : '';
  const displayName = name || username || email;
  return { ...user, displayName, email };
};

export {
  currentUserSelector,  // eslint-disable-line import/prefer-default-export
};
