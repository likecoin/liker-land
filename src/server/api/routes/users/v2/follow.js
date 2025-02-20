const { Router } = require('express');
const { authenticateV2Login } = require('../../../middleware/auth');
const { handleRestfulError } = require('../../../middleware/error');
const { isValidFollowee } = require('../../../util/cosmos');
const {
  db,
  FieldValue,
  walletUserCollection,
} = require('../../../../modules/firebase');
const { publisher, PUBSUB_TOPIC_MISC } = require('../../../../modules/pubsub');

const router = Router();

router.get('/followees', authenticateV2Login, async (req, res, next) => {
  try {
    const { user } = req.session;
    const userDoc = await walletUserCollection.doc(user).get();
    if (!userDoc.exists) {
      res.json({ followees: [] });
      return;
    }
    const { followees = [], pastFollowees = [] } = userDoc.data();
    res.json({ followees, pastFollowees });
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

router.delete('/followees', authenticateV2Login, async (req, res, next) => {
  try {
    const { user } = req.session;
    const { creator } = req.query;
    if (!isValidFollowee(user, creator)) {
      res.status(400).send('INVALID_CREATOR_ADDRESS');
      return;
    }
    await db.runTransaction(async t => {
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
