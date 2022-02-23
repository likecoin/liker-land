const { Router } = require('express');
const { setPrivateCacheHeader } = require('../../middleware/cache');
const {
  apiCivicLikerGetStaking,
  apiCivicLikerGetStakingInfo,
} = require('../../util/api');

const router = Router();

router.get('/civic/staking/info', async (req, res, next) => {
  try {
    const { data } = await apiCivicLikerGetStakingInfo(req);
    res.set('Cache-Control', 'public, max-age=86400');
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/civic/staking', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    const { data } = await apiCivicLikerGetStaking(req);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
