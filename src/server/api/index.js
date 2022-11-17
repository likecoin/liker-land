const crypto = require('crypto');
const { Router } = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const FirestoreStore = require('firestore-store')(session);
const { db } = require('../modules/firebase');
const users = require('./routes/users');
const usersV2 = require('./routes/users/v2');
const civic = require('./routes/civic');
const reader = require('./routes/reader');
const nft = require('./routes/nft');
const { COOKIE_SECRET } = require('../config/config');
const { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTION } = require('./constant');

const router = Router();

const cookieSecret =
  COOKIE_SECRET ||
  (process.env.NODE_ENV === 'production'
    ? crypto.randomBytes(16).toString('base64')
    : 'likecoin');

router.use(bodyParser.json());

/* Do not store JSON as string */
const store = new FirestoreStore({
  database: db,
  parser: {
    read: doc => doc.session,
    save: doc => {
      const data = JSON.parse(JSON.stringify(doc)); // clear object classes
      return {
        session: data,
        dateModified: Date.now(),
      };
    },
  },
});
store.touch = undefined; // hack to disable touch
router.use(
  session({
    store,
    name: AUTH_COOKIE_NAME,
    secret: cookieSecret,
    cookie: AUTH_COOKIE_OPTION,
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
  })
);
router.use((req, res, next) => {
  // HACK: mitigate issue that express-session set-cookie Expires contains comma
  // which makes firebase hosting wrongly split the set-cookie header into 2
  // mitigate by overide cookie serialize function and use MaxAge instead of Expires
  Object.defineProperty(req.session.cookie, 'data', {
    get() {
      return {
        originalMaxAge: this.originalMaxAge,
        maxAge: this.maxAge / 1000,
        secure: this.secure,
        httpOnly: this.httpOnly,
        domain: this.domain,
        path: this.path,
        sameSite: this.sameSite,
      };
    },
  });
  next();
});

router.use(cookieParser());
router.use(users);
router.use('/v2/users', usersV2);
router.use(civic);
router.use(reader);
router.use(nft);
router.get('/healthz', (_, res) => {
  res.sendStatus(200);
});
router.use((err, req, res, next) => {
  // return error format as per API
  if (err.response && err.response.status) {
    const { status, data, statusText } = err.response;
    return res.status(status).send(data || statusText);
  }
  const msg = (err.response && err.response.data) || err.message || err;
  console.error(msg); // eslint-disable-line no-console
  if (res.headersSent) {
    return next(err);
  }
  return res.sendStatus(500);
});

module.exports = router;
