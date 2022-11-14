const { Router } = require('express');
const {
  authenticateLogin,
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
      res.sendStatus(400);
      return;
    }
    const userDoc = await walletUserCollection(user).get();
    const { featuredNftClassIds = [] } = userDoc.data();
    res.json({ featured: featuredNftClassIds });
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

router.post(
  '/v2/users/:wallet/nfts/featured',
  authenticateLogin,
  checkWalletMatch,
  async (req, res, next) => {
    try {
      setPrivateCacheHeader(res);
      const { wallet: user } = req.params;
      const { nftClassIds = [] } = req.body;
      if (!nftClassIds.length) {
        res.sendStatus(400);
        return;
      }
      await walletUserCollection.doc(user).update({
        featuredNftClassIds: FieldValue.arrayUnion(...nftClassIds),
      });
      res.sendStatus(200);
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

router.delete(
  '/v2/users/:wallet/nfts/featured',
  authenticateLogin,
  checkWalletMatch,
  async (req, res, next) => {
    try {
      setPrivateCacheHeader(res);
      const { wallet: user } = req.params;
      const { nftClassIds = [] } = req.body;
      if (!nftClassIds.length) {
        res.sendStatus(400);
        return;
      }
      await walletUserCollection.doc(user).update({
        featuredNftClassIds: FieldValue.arrayRemove(...nftClassIds),
      });
      res.sendStatus(200);
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

module.exports = router;
