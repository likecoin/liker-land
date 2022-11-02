const axios = require('axios');
const crypto = require('crypto');
const { Router } = require('express');
const jwt = require('jsonwebtoken');
const { userCollection } = require('../../modules/firebase');
const { setPrivateCacheHeader } = require('../middleware/cache');
const {
  apiFetchUserProfile,
  apiFetchUserSuperLikeStatus,
  getOAuthCallbackAPI,
  getOAuthURL,
  apiFetchUserPreferences,
  apiUpdateUserPreferences,
} = require('../util/api');
const {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTION,
  OAUTH_SCOPE_REQUIRED,
} = require('../constant');
const { CRISP_USER_HASH_SECRET } = require('../../config/config');

const CLEAR_AUTH_COOKIE_OPTION = { ...AUTH_COOKIE_OPTION, maxAge: 0 };

function getCrispUserHash(email) {
  if (!CRISP_USER_HASH_SECRET) return undefined;
  return crypto
    .createHmac('sha256', CRISP_USER_HASH_SECRET)
    .update(email)
    .digest('hex');
}

function setSessionOAuthState(req) {
  const state = crypto.randomBytes(8).toString('hex');
  req.session.state = state;
}

const router = Router();

router.get('/users/self', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    const { user } = req.session;
    const { tz = 8 } = req.query;
    if (user) {
      const currentScopes = jwt.decode(req.session.accessToken).scope;
      if (!OAUTH_SCOPE_REQUIRED.every(s => currentScopes.includes(s))) {
        throw new Error('Insufficient scopes');
      }
      const [{ data }, { data: superLikeData }, userDoc] = await Promise.all([
        apiFetchUserProfile(req),
        apiFetchUserSuperLikeStatus(req, tz),
        userCollection.doc(user).get(),
      ]);
      const { hasReadWelcomeDialog } = userDoc.data();
      const { isSuperLiker } = superLikeData;
      res.json({
        user,
        hasReadWelcomeDialog,
        isSuperLiker,
        ...data,
        crispToken: getCrispUserHash(user),
      });
      await userCollection.doc(user).update({
        user: data,
        isSuperLiker,
      });
      return;
    }
    res.sendStatus(401);
  } catch (err) {
    if (req.session) req.session = null;
    res.clearCookie(AUTH_COOKIE_NAME, CLEAR_AUTH_COOKIE_OPTION);
    next(err);
  }
});

// if client only interested in knowing login status
router.get('/users/self/min', (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    const { user } = req.session;
    if (user) {
      const currentScopes = jwt.decode(req.session.accessToken).scope;
      if (!OAUTH_SCOPE_REQUIRED.every(s => currentScopes.includes(s))) {
        throw new Error('Insufficient scopes');
      }
      res.json({
        user,
        crispToken: getCrispUserHash(user),
      });
      return;
    }
    res.sendStatus(401);
  } catch (err) {
    if (req.session) req.session = null;
    res.clearCookie(AUTH_COOKIE_NAME, CLEAR_AUTH_COOKIE_OPTION);
    next(err);
  }
});

router.post('/users/self/update', async (req, res, next) => {
  try {
    const { user } = req.session;
    if (user) {
      const { hasReadWelcomeDialog } = req.body;
      await userCollection.doc(user).update({
        hasReadWelcomeDialog,
      });
      res.sendStatus(200);
      return;
    }
    res.sendStatus(401);
  } catch (err) {
    next(err);
  }
});

router.get('/users/preferences', async (req, res, next) => {
  try {
    const { data } = await apiFetchUserPreferences(req);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post('/users/preferences', async (req, res, next) => {
  try {
    await apiUpdateUserPreferences(req, req.body);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.get('/users/register', (req, res) => {
  setSessionOAuthState(req);
  const { from, referrer, language, utm_source: utmSource } = req.query;
  res.redirect(
    getOAuthURL({
      state: req.session.state,
      isRegister: true,
      from,
      referrer,
      language,
      utmSource,
    })
  );
});

router.get('/users/login', (req, res) => {
  setSessionOAuthState(req);
  const { from, referrer, language, utm_source: utmSource } = req.query;
  res.redirect(
    getOAuthURL({
      state: req.session.state,
      isRegister: false,
      from,
      referrer,
      language,
      utmSource,
    })
  );
});

router.post('/users/login', async (req, res, next) => {
  try {
    const { tz = 8 } = req.query;
    if (!req.body.authCode || !req.body.state) {
      res.status(400).send('missing state or authCode');
      return;
    }
    if (req.body.state !== req.session.state) {
      res.status(400).send('state mismatch');
      return;
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

    const [{ data: userData }, { data: superLikeData }] = await Promise.all([
      apiFetchUserProfile(req),
      apiFetchUserSuperLikeStatus(req, tz),
    ]);
    const { user } = userData;
    const { isSuperLiker } = superLikeData;
    req.session.user = user;

    const userDoc = await userCollection.doc(user).get();
    const isNew = !userDoc.exists;

    const payload = {
      user: userData,
      isSuperLiker,
      accessToken,
      refreshToken,
    };
    if (isNew) {
      await userCollection.doc(user).create(payload);
    } else {
      await userCollection.doc(user).update(payload);
    }

    res.json({
      user,
      ...userData,
      isSuperLiker,
      crispToken: getCrispUserHash(user),
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
