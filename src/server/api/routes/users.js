const axios = require('axios');
const crypto = require('crypto');
const { Router } = require('express');
const { userCollection } = require('../util/firebase');
const {
  apiFetchUserProfile,
  getOAuthCallbackAPI,
  getOAuthURL,
} = require('../util/api');
const { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTION } = require('../constant');
const { INTERCOM_USER_HASH_SECRET } = require('../../config/config');

const CLEAR_AUTH_COOKIE_OPTION = { ...AUTH_COOKIE_OPTION, maxAge: 0 };

function getIntercomUserHash(user) {
  if (!INTERCOM_USER_HASH_SECRET) return undefined;
  return crypto
    .createHmac('sha256', INTERCOM_USER_HASH_SECRET)
    .update(user)
    .digest('hex');
}

function setSessionOAuthState(req) {
  const state = crypto.randomBytes(8).toString('hex');
  req.session.state = state;
}

const router = Router();

router.get('/users/self', async (req, res, next) => {
  try {
    const { user } = req.session;
    if (user) {
      const { data } = await apiFetchUserProfile(req);
      res.json({ user, ...data, intercomToken: getIntercomUserHash(user) });
      await userCollection.doc(user).update({
        user: data,
      });
      return;
    }
    res.sendStatus(404);
  } catch (err) {
    if (req.session) req.session = null;
    res.clearCookie(AUTH_COOKIE_NAME, CLEAR_AUTH_COOKIE_OPTION);
    next(err);
  }
});

router.get('/users/register', (req, res) => {
  setSessionOAuthState(req);
  res.redirect(getOAuthURL({ state: req.session.state, isLogin: false }));
});

router.get('/users/login', (req, res) => {
  setSessionOAuthState(req);
  res.redirect(getOAuthURL({ state: req.session.state, isLogin: true }));
});

router.post('/users/login', async (req, res, next) => {
  try {
    if (!req.body.authCode || !req.body.state) {
      res.status(400).send('missing state or authCode');
      return;
    }
    if (req.body.state !== req.session.state) {
      res.status(400).send('state mismatch');
    }

    const { data: tokenData } = await axios.post(
      getOAuthCallbackAPI(req.body.authCode)
    );
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
    } = tokenData;
    req.session.accessToken = accessToken;
    req.session.state = undefined;

    const { data: userData } = await apiFetchUserProfile(req);
    const { user } = userData;
    req.session.user = user;

    const userDoc = await userCollection.doc(user).get();
    const isNew = !userDoc.exists;
    await userCollection.doc(user).set(
      {
        user: userData,
        accessToken,
        refreshToken,
      },
      { merge: true }
    );
    res.json({
      user,
      ...userData,
      intercomToken: getIntercomUserHash(user),
      isNew,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/users/logout', (req, res) => {
  if (req.session) req.session = null;
  res.clearCookie(AUTH_COOKIE_NAME, CLEAR_AUTH_COOKIE_OPTION);
  res.sendStatus(200);
});

module.exports = router;
