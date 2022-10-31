const { Router } = require('express');
const { firestore } = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

const { handleRestfulError } = require('../../middleware/error');

const {
  db,
  nftMintSubscriptionCollection,
} = require('../../../modules/firebase');

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
    await db.runTransaction(async t => {
      const querySnapshot = await t.get(queryRef);
      if (!querySnapshot.empty) {
        res.status(409).send('ALREADY_SUBSCRIBED');
        return;
      }

      const subscriptionId = uuidv4();
      const docRef = nftMintSubscriptionCollection.doc(subscriptionId);
      await t.set(docRef, {
        subscriberEmail,
        subscribedWallet,
        ts: firestore.FieldValue.serverTimestamp(),
      });
      res.json({ subscriptionId });
    });
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

router.get('/nft/mint-subscription', async (req, res, next) => {
  const { wallet: subscribedWallet, email: subscriberEmail } = req.query;
  if (!subscribedWallet) {
    res.status(400).send('MISSING_SUBSCRIPTION_WALLET');
    return;
  }

  if (!subscriberEmail) {
    res.status(400).send('MISSING_SUBSCRIBER_EMAIL');
    return;
  }

  try {
    const querySnapshot = await nftMintSubscriptionCollection
      .where('subscribedWallet', '==', subscribedWallet)
      .where('subscriberEmail', '==', subscriberEmail)
      .limit(1)
      .get();
    if (querySnapshot.empty) {
      res.status(404).send('SUBSCRIPTION_NOT_FOUND');
      return;
    }

    const [subscriptionDoc] = querySnapshot.docs;
    const ts = subscriptionDoc.get('ts').toMillis();
    res.json({ ts });
  } catch (err) {
    handleRestfulError(req, res, next, err);
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
    await db.runTransaction(async t => {
      const doc = await t.get(docRef);
      if (!doc.exists) {
        res.status(404).send('SUBSCRIPTION_NOT_FOUND');
        return;
      }

      const { subscriberEmail } = doc.data();
      if (email !== subscriberEmail) {
        res.status(404).send('SUBSCRIPTION_NOT_FOUND');
        return;
      }

      await t.set(docRef, { isVerified: true }, { merge: true });
      res.sendStatus(200);
    });
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

router.delete('/nft/mint-subscription/:id', async (req, res, next) => {
  const { id: subscriptionId } = req.params;
  try {
    await nftMintSubscriptionCollection.doc(subscriptionId).delete();
    res.sendStatus(200);
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

module.exports = router;
