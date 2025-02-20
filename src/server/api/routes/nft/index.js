const { Router } = require('express');

const mintSubscription = require('./mint-subscription');

const router = Router();

router.use(mintSubscription);

module.exports = router;
