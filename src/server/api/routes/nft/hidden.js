const { Router } = require('express');
const parse = require('url-parse');
const { setPrivateCacheHeader } = require('../../middleware/cache');
const { handleRestfulError } = require('../../middleware/error');
const { walletUserCollection } = require('../../util/firebase');

const router = Router();

router.get('/nft/hidden', async (req, res, next) => {
  try {
    const userId = req.query.owner;
    // TODO: check valid wallet
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
    if (!req.session.user || req.session.version !== 2) {
      res.sendStatus(401);
      return;
    }
    // TODO
    res.sendStatus(200);
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

router.delete('/nft/hidden', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    if (!req.session.user || req.session.version !== 2) {
      res.sendStatus(401);
      return;
    }
    // TODO
    res.sendStatus(200);
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

module.exports = router;
