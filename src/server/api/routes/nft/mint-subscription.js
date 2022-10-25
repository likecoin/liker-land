const { Router } = require('express');
const { firestore } = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

const { handleRestfulError } = require('../../middleware/error');

const { nftMintSubscriptionCollection } = require('../../util/firebase');

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
    const querySnapshot = await queryRef.get();
    if (!querySnapshot.empty) {
      res.status(409).send('ALREADY_SUBSCRIBED');
      return;
    }
    const subscriptionId = uuidv4();
    await nftMintSubscriptionCollection.doc(subscriptionId).create({
      subscriberEmail,
      subscribedWallet,
      ts: firestore.FieldValue.serverTimestamp(),
    });
    res.json({ subscriptionId });
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
