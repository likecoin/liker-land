const { Router } = require('express');
const {
  authenticateV2Login,
  checkParamWalletMatch,
} = require('../../../../middleware/auth');
const { setPrivateCacheHeader } = require('../../../../middleware/cache');
const { handleRestfulError } = require('../../../../middleware/error');
const { isValidAddress } = require('../../../../util/cosmos');
const {
  FieldValue,
  walletUserCollection,
} = require('../../../../../modules/firebase');
const {
  publisher,
  PUBSUB_TOPIC_MISC,
} = require('../../../../../modules/pubsub');

const router = Router();

router.get('/:wallet/nfts/featured', async (req, res, next) => {
  try {
    const { wallet: user } = req.params;
    if (!isValidAddress(user)) {
      res.status(400).send('INVALID_ADDRESS');
      return;
    }
    const userDoc = await walletUserCollection.doc(user).get();
    const { featuredNFTClassIds = [] } = userDoc.data() || {};
    res.json({ featured: featuredNFTClassIds });
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

router.get('/:wallet/nfts/hidden', async (req, res, next) => {
  try {
    const { wallet: user } = req.params;
    if (!isValidAddress(user)) {
      res.status(400).send('INVALID_ADDRESS');
      return;
    }
    const userDoc = await walletUserCollection.doc(user).get();
    const { hiddenNFTClassIds = [] } = userDoc.data() || {};
    res.json({ hidden: hiddenNFTClassIds });
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

router.post(
  '/:wallet/nfts/featured',
  authenticateV2Login,
  checkParamWalletMatch,
  async (req, res, next) => {
    try {
      setPrivateCacheHeader(res);
      const { wallet: user } = req.params;
      const { classId } = req.body;
      if (!classId) {
        res.status(400).send('CLASS_ID_MISSING');
        return;
      }
      await walletUserCollection.doc(user).update({
        featuredNFTClassIds: FieldValue.arrayUnion(classId),
      });
      publisher.publish(PUBSUB_TOPIC_MISC, req, {
        logType: 'dashboard_nft_display_state_feature',
        user,
        classId,
      });
      res.sendStatus(200);
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

router.post(
  '/:wallet/nfts/hidden',
  authenticateV2Login,
  checkParamWalletMatch,
  async (req, res, next) => {
    try {
      setPrivateCacheHeader(res);
      const { wallet: user } = req.params;
      const { classId } = req.body;
      if (!classId) {
        res.status(400).send('CLASS_ID_MISSING');
        return;
      }
      await walletUserCollection.doc(user).update({
        featuredNFTClassIds: FieldValue.arrayRemove(classId),
        hiddenNFTClassIds: FieldValue.arrayUnion(classId),
      });
      publisher.publish(PUBSUB_TOPIC_MISC, req, {
        logType: 'dashboard_nft_display_state_hide',
        user,
        classId,
      });
      res.sendStatus(200);
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

router.post(
  '/:wallet/nfts/unhidden',
  authenticateV2Login,
  checkParamWalletMatch,
  async (req, res, next) => {
    try {
      setPrivateCacheHeader(res);
      const { wallet: user } = req.params;
      const { classId } = req.body;
      if (!classId) {
        res.status(400).send('CLASS_ID_MISSING');
        return;
      }
      await walletUserCollection.doc(user).update({
        hiddenNFTClassIds: FieldValue.arrayRemove(classId),
      });
      publisher.publish(PUBSUB_TOPIC_MISC, req, {
        logType: 'dashboard_nft_display_state_unhide',
        user,
        classId,
      });
      res.sendStatus(200);
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

module.exports = router;
