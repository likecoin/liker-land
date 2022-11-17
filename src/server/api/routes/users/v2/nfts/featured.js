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

const router = Router();

router.get('/:wallet/nfts/featured', async (req, res, next) => {
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
      res.sendStatus(200);
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

router.delete(
  '/:wallet/nfts/featured/:classId',
  authenticateV2Login,
  checkParamWalletMatch,
  async (req, res, next) => {
    try {
      setPrivateCacheHeader(res);
      const { wallet: user, classId } = req.params;
      if (!classId) {
        res.status(400).send('CLASS_ID_MISSING');
        return;
      }
      await walletUserCollection.doc(user).update({
        featuredNFTClassIds: FieldValue.arrayRemove(classId),
      });
      res.sendStatus(200);
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

module.exports = router;
