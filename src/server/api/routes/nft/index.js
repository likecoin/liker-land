const { Router } = require('express');

const metadata = require('./metadata');
const mintSubscription = require('./mint-subscription');

const router = Router();

router.use(metadata);
router.use(mintSubscription);

module.exports = router;
