const { Router } = require('express');
const {
  authenticateV2Login,
  checkParamWalletMatch,
} = require('../../../middleware/auth');
const { setPrivateCacheHeader } = require('../../../middleware/cache');
const { handleRestfulError } = require('../../../middleware/error');
const { isValidAddress } = require('../../../util/cosmos');
const {
  db,
  FieldValue,
  walletUserCollection,
  nftMintSubscriptionCollection,
} = require('../../../../modules/firebase');
const { publisher, PUBSUB_TOPIC_MISC } = require('../../../../modules/pubsub');

const router = Router();

router.get(
  '/:wallet/followees',
  authenticateV2Login,
  checkParamWalletMatch,
  async (req, res, next) => {
    try {
      const { wallet: user } = req.params;
      const userDoc = await walletUserCollection.doc(user).get();
      if (!userDoc.exists) {
        res.json({ followees: [] });
        return;
      }
      const { followees: walletFollowees = [], email } = userDoc.data();
      let legacyFollowees = [];
      if (email) {
        const snapshot = await nftMintSubscriptionCollection
          .where('subscriberEmail', '==', email)
          .get();
        legacyFollowees = snapshot.docs.map(doc => {
          const { subscribedWallet } = doc.data();
          return subscribedWallet;
        });
      }
      const followees = [
        ...new Set([...walletFollowees, ...legacyFollowees]).values(),
      ];
      res.json({ followees });
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

router.post(
  '/:wallet/followers',
  authenticateV2Login,
  checkParamWalletMatch,
  async (req, res, next) => {
    try {
      setPrivateCacheHeader(res);
      const { wallet: user } = req.params;
      const { creator } = req.query;
      if (!isValidAddress(creator) || user === creator) {
        res.status(400).send('INVALID_CREATOR_ADDRESS');
        return;
      }
      await db.runTransaction(async t => {
        const userRef = walletUserCollection.doc(user);
        const userDoc = await t.get(userRef);
        const { email, emailUnconfirmed } = userDoc.data();
        if (!email) {
          if (emailUnconfirmed) {
            throw new Error('EMAIL_UNCONFIRMED');
          } else {
            throw new Error('EMAIL_NOT_SET_YET');
          }
        }
        await t.update(userRef, {
          followees: FieldValue.arrayUnion(creator),
        });
      });
      publisher.publish(PUBSUB_TOPIC_MISC, req, {
        logType: 'UserCreatorFollow',
        type: 'wallet',
        user,
        creatorWallet: creator,
      });
      res.sendStatus(200);
    } catch (err) {
      switch (err.message) {
        case 'EMAIL_UNCONFIRMED':
          res.status(403).send('EMAIL_UNCONFIRMED');
          break;
        case 'EMAIL_NOT_SET_YET':
          res.status(403).send('EMAIL_NOT_SET_YET');
          break;
        default:
          handleRestfulError(req, res, next, err);
      }
    }
  }
);

router.delete(
  '/:wallet/followers',
  authenticateV2Login,
  checkParamWalletMatch,
  async (req, res, next) => {
    try {
      setPrivateCacheHeader(res);
      const { wallet: user } = req.params;
      const { creator } = req.query;
      if (!isValidAddress(creator) || user === creator) {
        res.status(400).send('INVALID_CREATOR_ADDRESS');
        return;
      }
      await db.runTransaction(async t => {
        const userDoc = await t.get(walletUserCollection.doc(user));
        const { email } = userDoc.data();
        const snapshot = await t.get(
          nftMintSubscriptionCollection
            .where('subscriberEmail', '==', email)
            .where('subscribedWallet', '==', creator)
            .limit(1)
        );
        t.update(walletUserCollection.doc(user), {
          followees: FieldValue.arrayRemove(creator),
        });
        if (snapshot.docs.length > 0) {
          t.delete(snapshot.docs[0].ref);
        }
      });
      publisher.publish(PUBSUB_TOPIC_MISC, req, {
        logType: 'UserCreatorUnfollow',
        type: 'wallet',
        user,
        creatorWallet: creator,
      });
      res.sendStatus(200);
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

router.get(
  '/:wallet/followers',
  authenticateV2Login,
  checkParamWalletMatch,
  async (req, res, next) => {
    try {
      const { wallet: user } = req.params;
      const followerDocs = await walletUserCollection
        .where('followees', 'array-contains', user)
        .get();
      const followers = followerDocs.docs.map(doc => doc.id);
      res.json({ followers });
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

module.exports = router;
