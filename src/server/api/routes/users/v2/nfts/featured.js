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

const STATES = {
  featured: 'featured',
  hidden: 'hidden',
  normal: 'normal',
};

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
  '/:wallet/nfts/:state',
  authenticateV2Login,
  checkParamWalletMatch,
  async (req, res, next) => {
    try {
      setPrivateCacheHeader(res);
      const { wallet: user, state } = req.params;
      const { classId } = req.body;
      if (!classId) {
        res.status(400).send('CLASS_ID_MISSING');
        return;
      }
      if (!STATES[state]) {
        res.status(400).send('INVALID_STATE');
        return;
      }
      const payload = {};
      let logType;
      switch (state) {
        case STATES.featured:
          payload.featuredNFTClassIds = FieldValue.arrayUnion(classId);
          payload.hiddenNFTClassIds = FieldValue.arrayRemove(classId);
          logType = 'dashboard_nft_display_state_feature';
          break;
        case STATES.hidden:
          payload.featuredNFTClassIds = FieldValue.arrayRemove(classId);
          payload.hiddenNFTClassIds = FieldValue.arrayUnion(classId);
          logType = 'dashboard_nft_display_state_hide';
          break;
        case STATES.normal:
        default:
          payload.featuredNFTClassIds = FieldValue.arrayRemove(classId);
          payload.hiddenNFTClassIds = FieldValue.arrayRemove(classId);
          logType = 'dashboard_nft_display_state_unhide';
          break;
      }
      await walletUserCollection.doc(user).update(payload);
      publisher.publish(PUBSUB_TOPIC_MISC, req, {
        logType,
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
