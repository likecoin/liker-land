const { Router } = require('express');
const { authenticateV2Login } = require('../../../middleware/auth');
const { handleRestfulError } = require('../../../middleware/error');
const { isValidFollowee } = require('../../../util/cosmos');
const {
  db,
  FieldValue,
  walletUserCollection,
  nftMintSubscriptionCollection,
} = require('../../../../modules/firebase');
const { publisher, PUBSUB_TOPIC_MISC } = require('../../../../modules/pubsub');
const { setPrivateCacheHeader } = require('../../../middleware/cache');

const router = Router();

router.get('/followees', authenticateV2Login, async (req, res, next) => {
  try {
    const { user } = req.session;
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
});

router.get('/interacted', authenticateV2Login, async (req, res, next) => {
  try {
    const { user } = req.session;
    const userDoc = await walletUserCollection.doc(user).get();
    if (!userDoc.exists) {
      res.json({ interactedCreators: [] });
      return;
    }
    const { interactedCreators = [] } = userDoc.data();
    res.json({ interactedCreators });
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

router.post('/followees', authenticateV2Login, async (req, res, next) => {
  try {
    const { user } = req.session;
    const { creator } = req.query;
    if (!isValidFollowee(user, creator)) {
      res.status(400).send('INVALID_CREATOR_ADDRESS');
      return;
    }
    await db.runTransaction(async t => {
      const userRef = walletUserCollection.doc(user);
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
    handleRestfulError(req, res, next, err);
  }
});

router.post('/interacted', authenticateV2Login, async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    const { user } = req.session;
    const { creator } = req.query;
    if (!isValidFollowee(user, creator)) {
      res.status(400).send('INVALID_CREATOR_ADDRESS');
      return;
    }
    await db.runTransaction(async t => {
      const userRef = walletUserCollection.doc(user);
      await t.update(userRef, {
        interactedCreators: FieldValue.arrayUnion(creator),
      });
    });
    res.sendStatus(200);
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

router.delete('/followees', authenticateV2Login, async (req, res, next) => {
  try {
    const { user } = req.session;
    const { creator } = req.query;
    if (!isValidFollowee(user, creator)) {
      res.status(400).send('INVALID_CREATOR_ADDRESS');
      return;
    }
    await db.runTransaction(async t => {
      const userDoc = await t.get(walletUserCollection.doc(user));
      const { email } = userDoc.data();
      if (email) {
        const snapshot = await t.get(
          nftMintSubscriptionCollection
            .where('subscriberEmail', '==', email)
            .where('subscribedWallet', '==', creator)
            .limit(1)
        );
        if (snapshot.docs.length > 0) {
          t.delete(snapshot.docs[0].ref);
        }
      }
      t.update(walletUserCollection.doc(user), {
        followees: FieldValue.arrayRemove(creator),
      });
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
});

router.get('/followers', authenticateV2Login, async (req, res, next) => {
  try {
    const { user } = req.session;
    const followerDocs = await walletUserCollection
      .where('followees', 'array-contains', user)
      .get();
    const followers = followerDocs.docs.map(doc => doc.id);
    res.json({ followers });
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

module.exports = router;
