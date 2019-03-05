const { Router } = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const FirestoreStore = require('firestore-store')(session);
const { db } = require('./util/firebase');
const users = require('./routes/users');
const reader = require('./routes/reader');

const router = Router();

router.use(bodyParser.json());
router.use(
  session({
    store: new FirestoreStore({
      database: db,
    }),
    name: 'sid',
    secret: 'likecoin',
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
router.use(reader);

module.exports = router;
