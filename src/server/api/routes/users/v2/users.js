const { Router } = require('express');
const { walletUserCollection } = require('../../../util/firebase');
const { setPrivateCacheHeader } = require('../../../middleware/cache');
const { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTION } = require('../../../constant');
const {
  isValidAddress,
  checkCosmosSignPayload,
} = require('../../../util/cosmos');

const CLEAR_AUTH_COOKIE_OPTION = { ...AUTH_COOKIE_OPTION, maxAge: 0 };

const router = Router();

router.get('/users/v2/self', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    const { user } = req.session;
    if (user) {
      const userDoc = await walletUserCollection.doc(user).get();
      const { displayName } = userDoc.data();
      res.json({
        user,
        displayName,
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

router.post('/users/v2/login', async (req, res, next) => {
  const { from: inputWallet, signature, publicKey, message } = req.body;
  try {
    if (!inputWallet || !signature || !publicKey || !message) {
      res.sendStatus(400);
      return;
    }
    if (!isValidAddress(inputWallet)) {
      res.sendStatus(400);
      return;
    }

    try {
      checkCosmosSignPayload({
        signature,
        publicKey,
        message,
        inputWallet,
      });
    } catch (err) {
      res.status(401).send(err.message);
      return;
    }

    req.session.user = inputWallet;
    req.session.version = 2;

    const userId = inputWallet;
    const userDoc = await walletUserCollection.doc(userId).get();
    const isNew = !userDoc.exists;
    const currentTs = Date.now();
    const payload = {
      lastLoginTs: currentTs,
    };
    if (isNew) {
      await walletUserCollection.doc(userId).create({
        ...payload,
        ts: currentTs,
      });
    } else {
      await walletUserCollection.doc(userId).update(payload);
    }
    res.json({ isNew });
    return;
  } catch (error) {
    console.error(error);
    next(err);
  }
});

router.post('/users/v2/logout', (req, res) => {
  if (req.session) req.session = null;
  res.clearCookie(AUTH_COOKIE_NAME, CLEAR_AUTH_COOKIE_OPTION);
  res.sendStatus(200);
});

module.exports = router;
