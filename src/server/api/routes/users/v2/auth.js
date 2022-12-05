const { Router } = require('express');
const { db, walletUserCollection } = require('../../../../modules/firebase');
const { authenticateV2Login } = require('../../../middleware/auth');
const { setPrivateCacheHeader } = require('../../../middleware/cache');
const { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTION } = require('../../../constant');
const {
  isValidAddress,
  checkCosmosSignPayload,
} = require('../../../util/cosmos');

const CLEAR_AUTH_COOKIE_OPTION = { ...AUTH_COOKIE_OPTION, maxAge: 0 };

const router = Router();

router.get('/self', authenticateV2Login, async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    const { user } = req.session;
    const userDoc = await walletUserCollection.doc(user).get();
    const { displayName, followers } = userDoc.data();
    res.json({
      user,
      displayName,
      followers,
    });
  } catch (err) {
    if (req.session) req.session = null;
    res.clearCookie(AUTH_COOKIE_NAME, CLEAR_AUTH_COOKIE_OPTION);
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
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
    await db.runTransaction(async t => {
      const userRef = walletUserCollection.doc(userId);
      const userDoc = await t.get(userRef);
      const isNew = !userDoc.exists;
      const currentTs = Date.now();
      const payload = {
        lastLoginTs: currentTs,
      };
      if (isNew) {
        await t.create(userRef, {
          ...payload,
          ts: currentTs,
        });
      } else {
        await t.update(userRef, payload);
      }
      res.json({ isNew });
    });
    return;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    next(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session) req.session = null;
  res.clearCookie(AUTH_COOKIE_NAME, CLEAR_AUTH_COOKIE_OPTION);
  res.sendStatus(200);
});

module.exports = router;
