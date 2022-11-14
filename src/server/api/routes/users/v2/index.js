const { Router } = require('express');

const auth = require('./auth');
const follow = require('./follow');

const router = Router();

router.use(auth);
router.use(follow);

module.exports = router;
