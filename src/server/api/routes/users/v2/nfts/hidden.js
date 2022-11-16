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

router.get('/v2/users/:wallet/nfts/hidden', async (req, res, next) => {
  try {
    const { wallet: user } = req.params;
    if (!isValidAddress(user)) {
      res.status(400).send('INVALID_ADDRESS');
      return;
    }
    const userDoc = await walletUserCollection(user).get();
    const { hiddenNFTClassIds = [] } = userDoc.data();
    res.json({ hidden: hiddenNFTClassIds });
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

router.post(
  '/v2/users/:wallet/nfts/hidden',
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
        hiddenNFTClassIds: FieldValue.arrayUnion(classId),
      });
      res.sendStatus(200);
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

router.delete(
  '/v2/users/:wallet/nfts/hidden/:classId',
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
        hiddenNFTClassIds: FieldValue.arrayRemove(classId),
      });
      res.sendStatus(200);
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

module.exports = router;
