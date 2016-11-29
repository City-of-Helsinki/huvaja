const passport = require('passport');
const Strategy = require('passport-helsinki').Strategy;

function configurePassport() {
  const helsinkiStrategy = new Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: '/login/helsinki/return',
      proxy: Boolean(process.env.PROXY),
    },
    (accessToken, refreshToken, profile, cb) => {
      helsinkiStrategy.getAPIToken(accessToken, process.env.TARGET_APP, (token) => {
        const profileWithToken = Object.assign({}, profile, { token });
        return cb(null, profileWithToken);
      });
    });

  passport.use(helsinkiStrategy);

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });

  return passport;
}

module.exports = configurePassport;
