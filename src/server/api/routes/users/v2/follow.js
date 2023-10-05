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
const { getUserFollowees } = require('../../../util/api');

const router = Router();

router.get('/followees', authenticateV2Login, async (req, res, next) => {
  try {
    const { user } = req.session;
    const { followees, pastFollowees } = await getUserFollowees(user);
    res.json({ followees, pastFollowees });
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

router.get(
  '/suggested-followees',
  authenticateV2Login,
  async (req, res, next) => {
    try {
      const { user } = req.session;
      const { initialList = [] } = req.body;
      const { followees = [], pastFollowees = [] } = await getUserFollowees(
        user
      );

      const currentFollowees = [...followees, ...pastFollowees];
      const currentFolloweesSet = new Set(currentFollowees);

      const suggestedSet = new Set(initialList);
      let currentIndex = 0;

      // If we don't have enough suggestions, fetch more
      while (suggestedSet.size < 3 && currentIndex < currentFollowees.length) {
        // eslint-disable-next-line no-await-in-loop
        const { followees = [], pastFollowees = [] } = await getUserFollowees(
          currentFollowees[currentIndex]
        );

        const followSuggestions = [...followees, ...pastFollowees].filter(
          f => !currentFolloweesSet.has(f)
        );

        followSuggestions.forEach(suggestion => suggestedSet.add(suggestion));
        currentIndex += 1;
      }

      const result = [...suggestedSet].slice(0, 3);

      res.json({ result });
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

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
      await t.update(walletUserCollection.doc(user), {
        followees: FieldValue.arrayRemove(creator),
      });
      await t.update(walletUserCollection.doc(user), {
        pastFollowees: FieldValue.arrayUnion(creator),
      });
    });
    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'UserCreatorUnfollow',
      type: 'wallet',
      user,
      creatorWallet: creator,
    });
    res.sendStatus(200);
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
