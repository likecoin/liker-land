const { Router } = require('express');

const featured = require('./featured');
const hidden = require('./hidden');

const router = Router();

router.use(featured);
router.use(hidden);

module.exports = router;
