const { Router } = require('express');
const {
  authenticateV2Login,
  checkParamWalletMatch,
} = require('../../../middleware/auth');
const { setPrivateCacheHeader } = require('../../../middleware/cache');
const { handleRestfulError } = require('../../../middleware/error');
const { isValidAddress } = require('../../../util/cosmos');
const {
  FieldValue,
  walletUserCollection,
} = require('../../../../modules/firebase');

const router = Router();

router.get(
  '/:wallet/followers',
  authenticateV2Login,
  checkParamWalletMatch,
  async (req, res, next) => {
    try {
      const { wallet: user } = req.params;
      const userDoc = await walletUserCollection.doc(user).get();
      if (!userDoc.exists) {
        res.json({ followers: [] });
        return;
      }
      const { followers = [] } = userDoc.data();
      res.json({ followers });
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

router.post(
  '/:wallet/followers',
  authenticateV2Login,
  checkParamWalletMatch,
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
        followers: FieldValue.arrayUnion(creator),
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
        followers: FieldValue.arrayRemove(creator),
      });
      res.sendStatus(200);
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

router.get(
  '/:wallet/followees',
  authenticateV2Login,
  checkParamWalletMatch,
  async (req, res, next) => {
    try {
      const { wallet: user } = req.params;
      const followeeDocs = await walletUserCollection
        .where('followers', 'array-contains', user)
        .get();
      const followees = followeeDocs.docs.map(doc => doc.id);
      res.json({ followees });
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

module.exports = router;
