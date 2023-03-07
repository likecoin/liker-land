const { Router } = require('express');
const {
  db,
  FieldValue,
  walletUserCollection,
} = require('../../../../modules/firebase');
const { authenticateV2Login } = require('../../../middleware/auth');
const { setPrivateCacheHeader } = require('../../../middleware/cache');
const {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTION,
  DEFAULT_LOCALE,
} = require('../../../constant');
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
    const {
      displayName,
      email,
      emailUnconfirmed,
      eventLastSeenTs,
      locale = DEFAULT_LOCALE,
    } = userDoc.data();
    res.json({
      user,
      displayName,
      email,
      emailUnconfirmed,
      eventLastSeenTs: eventLastSeenTs ? eventLastSeenTs.toMillis() : 1000,
      locale,
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
      const payload = {
        lastLoginTs: FieldValue.serverTimestamp(),
      };
      if (isNew) {
        await t.create(userRef, {
          ...payload,
          ts: FieldValue.serverTimestamp(),
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
