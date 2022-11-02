const { Router } = require('express');
const { setPrivateCacheHeader } = require('../../middleware/cache');
const { handleRestfulError } = require('../../middleware/error');
const { isValidAddress } = require('../../util/cosmos');
const { walletUserCollection } = require('../../util/firebase');

const router = Router();

router.get('/nft/featured', async (req, res, next) => {
  try {
    const userId = req.query.owner;
    if (!isValidAddress(userId)) {
      res.sendStatus(400);
      return;
    }
    const userDoc = await walletUserCollection(userId).get();
    const { featuredNftClassIds = [] } = userDoc.data();
    res.json({ featured: featuredNftClassIds });
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

router.post('/nft/featured', async (req, res, next) => {
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
    const { featuredNftClassIds = [] } = userDoc.data();
    const newFeaturedNftClassIds = Array.from(
      new Set([...featuredNftClassIds, ...inputNftClassIds])
    );
    await userDoc.ref.update({ featuredNftClassIds: newFeaturedNftClassIds });
    res.sendStatus(200);
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

router.delete('/nft/featured', async (req, res, next) => {
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
    const { featuredNftClassIds = [] } = userDoc.data();
    const set = new Set(featuredNftClassIds);
    inputNftClassIds.forEach(classId => {
      if (set.has(classId)) set.delete(classId);
    });
    const newFeaturedNftClassIds = Array.from(set);
    await userDoc.ref.update({ featuredNftClassIds: newFeaturedNftClassIds });
    res.sendStatus(200);
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

module.exports = router;
