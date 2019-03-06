const axios = require('axios');
const { Router } = require('express');
const { userCollection } = require('../util/firebase');
const { getOAuthCallbackAPI } = require('../util/api');

const router = Router();

router.get('/users/self', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
    return;
  }
  res.sendStatus(404);
});

router.post('/users/login', async (req, res, next) => {
  try {
    if (!req.body.authCode) {
      res.sendStatus(400);
      return;
    }
    const { data } = await axios.get(getOAuthCallbackAPI(req.body.authCode));
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    } = data;
    await userCollection.doc(user).set(
      {
        accessToken,
        refreshToken,
      },
      { merge: true }
    );
    req.session.user = user;
    req.session.accessToken = accessToken;
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.post('/users/logout', (req, res) => {
  req.session = null;
  res.sendStatus(200);
});

module.exports = router;
