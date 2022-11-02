const { Router } = require('express');
const { setPrivateCacheHeader } = require('../../middleware/cache');
const { handleRestfulError } = require('../../middleware/error');
const { isValidAddress } = require('../../util/cosmos');
const { walletUserCollection } = require('../../util/firebase');

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
    const { nftClassIds: inputNftClassIds = [] } = req.body;
    if (!inputNftClassIds.length) {
      res.sendStatus(400);
      return;
    }
    const userDoc = await walletUserCollection(user).get();
    const { hiddenNftClassIds = [] } = userDoc.data();
    const newHiddenNftClassIds = Array.from(
      new Set([...hiddenNftClassIds, ...inputNftClassIds])
    );
    await userDoc.ref.update({ hiddenNftClassIds: newHiddenNftClassIds });
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
    const { nftClassIds: inputNftClassIds = [] } = req.body;
    if (!inputNftClassIds.length) {
      res.sendStatus(400);
      return;
    }
    const userDoc = await walletUserCollection(user).get();
    const { hiddenNftClassIds = [] } = userDoc.data();
    const set = new Set(hiddenNftClassIds);
    inputNftClassIds.forEach(classId => {
      if (set.has(classId)) set.delete(classId);
    });
    const newHiddenNftClassIds = Array.from(set);
    await userDoc.ref.update({ hiddenNftClassIds: newHiddenNftClassIds });
    res.sendStatus(200);
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

module.exports = router;
