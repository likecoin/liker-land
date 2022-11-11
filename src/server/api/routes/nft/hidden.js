const { Router } = require('express');
const { setPrivateCacheHeader } = require('../../middleware/cache');
const { handleRestfulError } = require('../../middleware/error');
const { isValidAddress } = require('../../util/cosmos');
const {
  FieldValue,
  walletUserCollection,
} = require('../../../modules/firebase');

const router = Router();

router.get('/nft/hidden', async (req, res, next) => {
  try {
    const userId = req.query.owner;
    if (!isValidAddress(userId)) {
      res.sendStatus(400);
      return;
    }
    const userDoc = await walletUserCollection(userId).get();
    const { hiddenNftClassIds = [] } = userDoc.data();
    res.json({ hidden: hiddenNftClassIds });
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

router.post('/nft/hidden', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    const { user, version } = req.session;
    if (!user || version !== 2) {
      res.sendStatus(401);
      return;
    }
    const { nftClassIds = [] } = req.body;
    if (!nftClassIds.length) {
      res.sendStatus(400);
      return;
    }
    await walletUserCollection.doc(user).update({
      hiddenNftClassIds: FieldValue.arrayUnion(...nftClassIds),
    });
    res.sendStatus(200);
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

router.delete('/nft/hidden', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    const { user, version } = req.session;
    if (!user || version !== 2) {
      res.sendStatus(401);
      return;
    }
    const { nftClassIds = [] } = req.body;
    if (!nftClassIds.length) {
      res.sendStatus(400);
      return;
    }
    await walletUserCollection.doc(user).update({
      hiddenNftClassIds: FieldValue.arrayRemove(...nftClassIds),
    });
    res.sendStatus(200);
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

module.exports = router;
