const axios = require('axios');
const crypto = require('crypto');
const { Router } = require('express');
const { userCollection } = require('../util/firebase');
const {
  apiFetchUserProfile,
  getOAuthCallbackAPI,
  getOAuthURL,
} = require('../util/api');

const router = Router();

router.get('/users/self', async (req, res, next) => {
  try {
    if (req.session.user) {
      const { data } = await apiFetchUserProfile(req);
      res.json({ user: req.session.user, ...data });
      return;
    }
    res.sendStatus(404);
  } catch (err) {
    next(err);
  }
});

router.get('/users/login', (req, res) => {
  const state = crypto.randomBytes(8).toString('hex');
  req.session.state = state;
  res.redirect(getOAuthURL(state));
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
      user,
    } = tokenData;
    await userCollection.doc(user).set(
      {
        accessToken,
        refreshToken,
      },
      { merge: true }
    );
    req.session.user = user;
    req.session.accessToken = accessToken;
    req.session.state = undefined;
    const { data: userData } = await apiFetchUserProfile(req);
    res.json({ user, ...userData });
  } catch (err) {
    next(err);
  }
});

router.post('/users/logout', (req, res) => {
  req.session = null;
  res.sendStatus(200);
});

module.exports = router;
