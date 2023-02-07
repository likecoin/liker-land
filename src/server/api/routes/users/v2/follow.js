const { Router } = require('express');
const {
  authenticateV2Login,
  checkParamWalletMatch,
  checkEmailHasVerified,
} = require('../../../middleware/auth');
const { setPrivateCacheHeader } = require('../../../middleware/cache');
const { handleRestfulError } = require('../../../middleware/error');
const { isValidAddress } = require('../../../util/cosmos');
const {
  db,
  FieldValue,
  walletUserCollection,
} = require('../../../../modules/firebase');

const router = Router();

router.get(
  '/:wallet/followees',
  authenticateV2Login,
  checkParamWalletMatch,
  async (req, res, next) => {
    try {
      const { wallet: user } = req.params;
      const userDoc = await walletUserCollection.doc(user).get();
      if (!userDoc.exists) {
        res.json({ followees: [] });
        return;
      }
      const { followees = [] } = userDoc.data();
      res.json({ followees });
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

router.post(
  '/:wallet/followers',
  authenticateV2Login,
  checkParamWalletMatch,
  checkEmailHasVerified,
  async (req, res, next) => {
    try {
      setPrivateCacheHeader(res);
      const { wallet: user } = req.params;
      const { creator } = req.query;
      if (!isValidAddress(creator) || user === creator) {
        res.status(400).send('INVALID_CREATOR_ADDRESS');
        return;
      }
      await walletUserCollection.doc(user).update({
        followees: FieldValue.arrayUnion(creator),
      });
      res.sendStatus(200);
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

router.delete(
  '/:wallet/followers',
  authenticateV2Login,
  checkParamWalletMatch,
  checkEmailHasVerified,
  async (req, res, next) => {
    try {
      setPrivateCacheHeader(res);
      const { wallet: user } = req.params;
      const { creator } = req.query;
      if (!isValidAddress(creator) || user === creator) {
        res.status(400).send('INVALID_CREATOR_ADDRESS');
        return;
      }
      await walletUserCollection.doc(user).update({
        followees: FieldValue.arrayRemove(creator),
      });
      res.sendStatus(200);
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

router.get(
  '/:wallet/followers',
  authenticateV2Login,
  checkParamWalletMatch,
  async (req, res, next) => {
    try {
      const { wallet: user } = req.params;
      const followerDocs = await walletUserCollection
        .where('followees', 'array-contains', user)
        .get();
      const followers = followerDocs.docs.map(doc => doc.id);
      res.json({ followers });
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

module.exports = router;
