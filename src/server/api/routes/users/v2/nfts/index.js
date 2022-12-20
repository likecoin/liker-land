const { Router } = require('express');

const displayState = require('./display-state');

const router = Router();

router.use(displayState);

module.exports = router;
