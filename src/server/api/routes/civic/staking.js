const { Router } = require('express');
const { setPrivateCacheHeader } = require('../../middleware/cache');
const { apiCivicLikerGetStaking } = require('../../util/api');

const router = Router();

router.get('/civic/staking', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const { data } = await apiCivicLikerGetStaking(req);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
