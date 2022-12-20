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

const NFT_DISPLAY_STATE = {
  FEATURED: 'featured',
  HIDDEN: 'hidden',
  DEFAULT: 'default',
};

const router = Router();

router.get('/:wallet/nfts/display-state', async (req, res, next) => {
  try {
    const { wallet: user } = req.params;
    if (!isValidAddress(user)) {
      res.status(400).send('INVALID_ADDRESS');
      return;
    }
    const userDoc = await walletUserCollection.doc(user).get();
    const { featuredNFTClassIds = [], hiddenNFTClassIds = [] } =
      userDoc.data() || {};
    res.json({ featured: featuredNFTClassIds, hidden: hiddenNFTClassIds });
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

router.post(
  '/:wallet/nfts/display-state',
  authenticateV2Login,
  checkParamWalletMatch,
  async (req, res, next) => {
    try {
      setPrivateCacheHeader(res);
      const { wallet: user } = req.params;
      const { classId, displayState } = req.body;
      if (!classId) {
        res.status(400).send('CLASS_ID_MISSING');
        return;
      }

      const payload = {};
      let logType;
      switch (displayState) {
        case NFT_DISPLAY_STATE.FEATURED:
          payload.featuredNFTClassIds = FieldValue.arrayUnion(classId);
          payload.hiddenNFTClassIds = FieldValue.arrayRemove(classId);
          logType = 'dashboard_nft_display_state_feature';
          break;
        case NFT_DISPLAY_STATE.HIDDEN:
          payload.featuredNFTClassIds = FieldValue.arrayRemove(classId);
          payload.hiddenNFTClassIds = FieldValue.arrayUnion(classId);
          logType = 'dashboard_nft_display_state_hide';
          break;
        case NFT_DISPLAY_STATE.DEFAULT:
          payload.featuredNFTClassIds = FieldValue.arrayRemove(classId);
          payload.hiddenNFTClassIds = FieldValue.arrayRemove(classId);
          logType = 'dashboard_nft_display_state_reset';
          break;
        default:
          res.status(400).send('INVALID_STATE');
          return;
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
