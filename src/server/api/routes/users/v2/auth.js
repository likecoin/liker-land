const { Router } = require('express');
const {
  db,
  FieldValue,
  walletUserCollection,
} = require('../../../../modules/firebase');
const { authenticateV2Login } = require('../../../middleware/auth');
const { publisher, PUBSUB_TOPIC_MISC } = require('../../../../modules/pubsub');
const {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTION,
  DEFAULT_LOCALE,
} = require('../../../constant');
const {
  isValidAddress,
  checkCosmosSignPayload,
} = require('../../../util/cosmos');
const { getCrispUserHash, upsertCrispProfile } = require('../../../util/crisp');

const CLEAR_AUTH_COOKIE_OPTION = { ...AUTH_COOKIE_OPTION, maxAge: 0 };

const router = Router();

router.get('/self', authenticateV2Login, async (req, res, next) => {
  try {
    const { user } = req.session;
    const userDoc = await walletUserCollection.doc(user).get();
    const {
      displayName,
      email,
      emailUnconfirmed,
      eventLastSeenTs,
      lastLoginMethod: loginMethod,
      locale = DEFAULT_LOCALE,
      cart,
    } = userDoc.data();
    if (email) {
      try {
        await upsertCrispProfile(email, {
          displayName,
          wallet: user,
          loginMethod,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
    res.json({
      user,
      displayName,
      email,
      emailUnconfirmed,
      eventLastSeenTs: eventLastSeenTs ? eventLastSeenTs.toMillis() : 1000,
      locale,
      crispToken: email ? getCrispUserHash(email) : undefined,
      cart,
    });
  } catch (err) {
    if (req.session) req.session = null;
    res.clearCookie(AUTH_COOKIE_NAME, CLEAR_AUTH_COOKIE_OPTION);
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  const {
    from: inputWallet,
    signature,
    publicKey,
    message,
    signMethod,
    loginMethod = '',
    gaClientId,
    userIdHash,
    cart,
  } = req.body;
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
        signMethod,
      });
    } catch (err) {
      res.status(401).send(err.message);
      return;
    }

    req.session.user = inputWallet;
    req.session.version = 2;

    const userId = inputWallet;
    const result = await db.runTransaction(async t => {
      const userRef = walletUserCollection.doc(userId);
      const userDoc = await t.get(userRef);
      const isNew = !userDoc.exists;
      const userDocData = userDoc.data();
      const payload = {
        lastLoginTs: FieldValue.serverTimestamp(),
        lastLoginMethod: loginMethod,
      };
      if (gaClientId) payload.gaClientId = gaClientId;
      if (userIdHash) payload.userIdHash = userIdHash;
      if (isNew) {
        await t.create(userRef, {
          ...payload,
          registerLoginMethod: loginMethod,
          ts: FieldValue.serverTimestamp(),
        });
      } else {
        await t.update(userRef, payload);
      }
      return { ...userDocData, isNew };
    });
    const { isNew, email, displayName } = result;
    if (result.isNew) {
      publisher.publish(PUBSUB_TOPIC_MISC, req, {
        logType: 'UserSignUp',
        signMethod,
        loginMethod,
        gaClientId,
        userIdHash,
        user: userId,
      });
    } else {
      publisher.publish(PUBSUB_TOPIC_MISC, req, {
        logType: 'UserLogin',
        signMethod,
        loginMethod,
        gaClientId,
        userIdHash,
        user: userId,
      });
    }
    if (email) {
      try {
        await upsertCrispProfile(email, {
          displayName,
          wallet: userId,
          loginMethod,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
    const payload = {
      user: userId,
      displayName,
      isNew,
      crispToken: email ? getCrispUserHash(email) : undefined,
      cart,
    };
    res.json(payload);
    return;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    next(error);
  }
});

router.post('/logout', (req, res) => {
  if (req.session) req.session = null;
  res.clearCookie(AUTH_COOKIE_NAME, CLEAR_AUTH_COOKIE_OPTION);
  res.sendStatus(200);
});

module.exports = router;
