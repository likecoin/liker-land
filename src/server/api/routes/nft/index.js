const { Router } = require('express');

const mintSubscription = require('./mint-subscription');
const featured = require('./featured');
const hidden = require('./hidden');

const router = Router();

router.use(mintSubscription);
router.use(featured);
router.use(hidden);

module.exports = router;
