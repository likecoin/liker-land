const { Router } = require('express');

const staking = require('./staking');

const router = Router();

router.use(staking);

module.exports = router;
