const { Router } = require('express');
const {
  authenticateV2Login,
  checkWalletMatch,
} = require('../../../../middleware/auth');
const { setPrivateCacheHeader } = require('../../../../middleware/cache');
const { handleRestfulError } = require('../../../../middleware/error');
const { isValidAddress } = require('../../../../util/cosmos');
const {
  FieldValue,
  walletUserCollection,
} = require('../../../../../modules/firebase');

const router = Router();

router.get('/v2/users/:wallet/nfts/featured', async (req, res, next) => {
  try {
    const { wallet: user } = req.params;
    if (!isValidAddress(user)) {
      res.status(400).send('INVALID_ADDRESS');
      return;
    }
    const userDoc = await walletUserCollection(user).get();
    const { featuredNFTClassIds = [] } = userDoc.data();
    res.json({ featured: featuredNFTClassIds });
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

router.post(
  '/v2/users/:wallet/nfts/featured',
  authenticateV2Login,
  checkWalletMatch,
  async (req, res, next) => {
    try {
      setPrivateCacheHeader(res);
      const { wallet: user } = req.params;
      const { nftClassIds = [] } = req.body;
      if (!nftClassIds.length) {
        res.status(400).send('NFT_CLASS_ID_MISSING');
        return;
      }
      await walletUserCollection.doc(user).update({
        featuredNFTClassIds: FieldValue.arrayUnion(...nftClassIds),
      });
      res.sendStatus(200);
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

router.delete(
  '/v2/users/:wallet/nfts/featured',
  authenticateV2Login,
  checkWalletMatch,
  async (req, res, next) => {
    try {
      setPrivateCacheHeader(res);
      const { wallet: user } = req.params;
      const { nftClassIds = [] } = req.body;
      if (!nftClassIds.length) {
        res.status(400).send('NFT_CLASS_ID_MISSING');
        return;
      }
      await walletUserCollection.doc(user).update({
        featuredNFTClassIds: FieldValue.arrayRemove(...nftClassIds),
      });
      res.sendStatus(200);
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

module.exports = router;
