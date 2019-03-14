const crypto = require('crypto');
const { Router } = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const FirestoreStore = require('firestore-store')(session);
const { db } = require('./util/firebase');
const users = require('./routes/users');
const civic = require('./routes/civic');
const reader = require('./routes/reader');
const { COOKIE_SECRET } = require('../config/config');

const router = Router();

const cookieSecret =
  COOKIE_SECRET ||
  (process.env.NODE_ENV === 'production'
    ? crypto.randomBytes(16).toString('base64')
    : 'likecoin');

router.use(bodyParser.json());
router.use(
  session({
    store: new FirestoreStore({
      database: db,
    }),
    name: '__session',
    secret: cookieSecret,
    cookie: {
      maxAge: 2592000000, // 30days
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
  })
);
router.use(users);
router.use(civic);
router.use(reader);
router.use((err, req, res, next) => {
  const msg = (err.response && err.response.data) || err.message || err;
  console.error(msg); // eslint-disable-line no-console
  if (res.headersSent) {
    return next(err);
  }
  return res.sendStatus(500);
});

module.exports = router;
