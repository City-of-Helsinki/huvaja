const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const express = require('express');

const configurePassport = require('./configurePassport');
const getAuthState = require('./getAuthState');

const router = express.Router();  // eslint-disable-line new-cap
const passport = configurePassport();
const maxSessionAge = 4 * 60 * 60 * 1000;  // 4 hours

// Session handling
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({
  store: new RedisStore({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  }),
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: maxSessionAge,
  },
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport and restore authentication state, if any, from the
// session.
router.use(passport.initialize());
router.use(passport.session());

router.get('/auth', (req, res) => {
  res.json(getAuthState(req));
});

router.get('/login', passport.authenticate('helsinki'));

router.get('/login/helsinki/return',
  passport.authenticate('helsinki', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/')
);

router.get('/logout', (req, res) => {
  req.logOut();
  const redirectUrl = req.query.next || '/';
  res.redirect(`https://api.hel.fi/sso/logout/?next=${redirectUrl}`);
});

module.exports = router;
