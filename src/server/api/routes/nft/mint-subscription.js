const { Router } = require('express');
const { firestore } = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

const { VERIFICATION_EMAIL_RESEND_COOLDOWN_IN_MS } = require('../../constant');
const { handleRestfulError } = require('../../middleware/error');

const {
  db,
  nftMintSubscriptionCollection,
} = require('../../../modules/firebase');
const { publisher, PUBSUB_TOPIC_MISC } = require('../../../modules/pubsub');

const router = Router();

router.post('/nft/mint-subscription', async (req, res, next) => {
  const { wallet: subscribedWallet, email: subscriberEmail } = req.query;
  if (!subscribedWallet) {
    res.status(400).send('MISSING_SUBSCRIPTION_WALLET');
    return;
  }

  if (!subscriberEmail) {
    res.status(400).send('MISSING_SUBSCRIBER_EMAIL');
    return;
  }

  const queryRef = nftMintSubscriptionCollection
    .where('subscriberEmail', '==', subscriberEmail)
    .where('subscribedWallet', '==', subscribedWallet)
    .limit(1);
  try {
    const result = await db.runTransaction(async t => {
      const querySnapshot = await t.get(queryRef);
      let subscriptionId;
      if (!querySnapshot.empty) {
        const [doc] = querySnapshot.docs;
        const { isVerified, ts } = doc.data();
        if (isVerified) {
          throw new Error('ALREADY_SUBSCRIBED');
        }
        if (
          Date.now() - ts.toMillis() <
          VERIFICATION_EMAIL_RESEND_COOLDOWN_IN_MS
        ) {
          throw new Error('SUBSCRIBE_IN_COOLDOWN');
        }
        subscriptionId = doc.id;
      }

      if (!subscriptionId) {
        subscriptionId = uuidv4();
      }
      const docRef = nftMintSubscriptionCollection.doc(subscriptionId);
      await t.set(docRef, {
        isVerified: false,
        subscriberEmail,
        subscribedWallet,
        ts: firestore.FieldValue.serverTimestamp(),
      });
      return { subscriptionId };
    });
    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'UserCreatorFollowUnverified',
      type: 'email',
      email: subscriberEmail,
      creatorWallet: subscribedWallet,
    });
    res.json(result);
  } catch (err) {
    switch (err.message) {
      case 'ALREADY_SUBSCRIBED':
        res.status(409).send(err.message);
        break;

      case 'SUBSCRIBE_IN_COOLDOWN':
        res.status(429).send(err.message);
        break;

      default:
        handleRestfulError(req, res, next, err);
    }
  }
});

router.get('/nft/mint-subscription/:id', async (req, res, next) => {
  const { id: subscriptionId } = req.params;
  try {
    const subscriptionDoc = await nftMintSubscriptionCollection
      .doc(subscriptionId)
      .get();
    if (!subscriptionDoc.exists) {
      res.status(404).send('SUBSCRIPTION_NOT_FOUND');
      return;
    }
    const { ts, subscribedWallet, isVerified = false } = subscriptionDoc.data();
    res.json({
      subscribedWallet,
      isVerified,
      ts: ts.toMillis(),
    });
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

router.put('/nft/mint-subscription/:id', async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) {
      res.status(400).send('MISSING_SUBSCRIBER_EMAIL');
      return;
    }

    const { id: subscriptionId } = req.params;
    const docRef = nftMintSubscriptionCollection.doc(subscriptionId);
    const { subscribedWallet, subscriberEmail } = await db.runTransaction(
      async t => {
        const doc = await t.get(docRef);
        if (!doc.exists) {
          throw new Error('SUBSCRIPTION_NOT_FOUND');
        }
        const docData = doc.data();
        const { subscriberEmail: docEmail } = docData;
        if (email !== docEmail) {
          throw new Error('SUBSCRIPTION_NOT_FOUND');
        }
        await t.update(docRef, { isVerified: true });
        return docData;
      }
    );
    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'UserCreatorFollow',
      type: 'email',
      email: subscriberEmail,
      creatorWallet: subscribedWallet,
    });
    res.sendStatus(200);
  } catch (err) {
    if (err.message === 'SUBSCRIPTION_NOT_FOUND') {
      res.status(404).send(err.message);
    } else {
      handleRestfulError(req, res, next, err);
    }
  }
});

router.delete('/nft/mint-subscription/:id', async (req, res, next) => {
  const { id: subscriptionId } = req.params;
  try {
    const docRef = nftMintSubscriptionCollection.doc(subscriptionId);
    const doc = await docRef.get();
    if (!doc.exists) throw new Error('SUBSCRIPTION_NOT_FOUND');
    const { subscriberEmail, subscribedWallet } = doc.data();
    await docRef.delete();
    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'UserCreatorUnfollow',
      type: 'email',
      email: subscriberEmail,
      creatorWallet: subscribedWallet,
    });
    res.sendStatus(200);
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

module.exports = router;
