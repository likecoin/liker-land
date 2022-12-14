const { Router } = require('express');

const featured = require('./featured');

const router = Router();

router.use(featured);

module.exports = router;
