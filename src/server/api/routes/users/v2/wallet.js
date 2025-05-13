const { Router } = require('express');
const {
  db,
  FieldValue,
  walletUserCollection,
} = require('../../../../modules/firebase');
const { GET_WALLET_API_SECRET } = require('../../../../config/config');

const router = Router();

router.get('/wallet', async (req, res, next) => {
  try {
    const key = req.headers['x-likerland-api-key'];
    const { email, wallet } = req.query;
    if (email && wallet) {
      res.status(400).send('INVALID_QUERY');
      return;
    }
    if (!key || key !== GET_WALLET_API_SECRET) {
      res.status(403).send('INVALID_KEY');
      return;
    }
    let userDoc;
    if (wallet) {
      userDoc = await walletUserCollection.doc(wallet).get();
      if (!userDoc.exists) {
        res.status(404).send('USER_NOT_FOUND');
        return;
      }
    } else if (email) {
      const userQuery = await walletUserCollection
        .where('email', '==', email)
        .limit(1)
        .get();
      if (userQuery.empty) {
        res.status(404).send('USER_NOT_FOUND');
        return;
      }
      [userDoc] = userQuery.docs;
    } else {
      res.status(400).send('MISSING_QUERY');
      return;
    }
    const userWallet = userDoc.id;
    const {
      lastLoginMethod,
      registerLoginMethod,
      displayName,
      email: docEmail,
      emailUnconfirmed,
    } = userDoc.data();
    res.json({
      wallet: userWallet,
      lastLoginMethod,
      registerLoginMethod,
      displayName,
      email: docEmail,
      emailUnconfirmed,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/wallet/evm/migrate', async (req, res, next) => {
  try {
    const key = req.headers['x-likerland-api-key'];
    const { wallet } = req.query;
    const { evmWallet } = req.body;
    if (!wallet) {
      res.status(400).send('INVALID_QUERY');
      return;
    }
    if (!evmWallet) {
      res.status(400).send('MISSING_BODY');
      return;
    }
    if (!key || key !== GET_WALLET_API_SECRET) {
      res.status(403).send('INVALID_KEY');
      return;
    }
    let user;
    try {
      user = await db.runTransaction(async t => {
        const [walletQuery, userDoc] = await Promise.all([
          t.get(
            walletUserCollection.where('evmWallet', '==', evmWallet).limit(1)
          ),
          t.get(walletUserCollection.doc(wallet)),
        ]);
        if (walletQuery.size > 0) {
          throw new Error('WALLET_ALREADY_USED');
        }
        if (!userDoc.exists) {
          throw new Error('USER_NOT_FOUND');
        }
        const userData = userDoc.data();
        if (userData.evmWallet) {
          throw new Error('WALLET_ALREADY_MIGRATED');
        }
        const likeWallet = userDoc.id;
        t.update(walletUserCollection.doc(wallet), {
          evmWallet,
          migrateTimestamp: FieldValue.serverTimestamp(),
        });
        t.create(walletUserCollection.doc(evmWallet), {
          ...userData,
          likeWallet,
          migrateTimestamp: FieldValue.serverTimestamp(),
        });
        return {
          id: likeWallet,
          likeWallet,
          ...userData,
        };
      });
    } catch (err) {
      res.status(400).send(err.message);
      return;
    }
    const {
      lastLoginMethod,
      registerLoginMethod,
      displayName,
      email: docEmail,
      emailUnconfirmed,
    } = user;
    res.json({
      id: user.id,
      likeWallet: user.likeWallet,
      evmWallet: user.evmWallet,
      lastLoginMethod,
      registerLoginMethod,
      displayName,
      email: docEmail,
      emailUnconfirmed,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
