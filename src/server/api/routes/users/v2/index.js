const { Router } = require('express');

const auth = require('./auth');
const event = require('./event');
const follow = require('./follow');
const nfts = require('./nfts');

const router = Router();

router.use(auth);
router.use(event);
router.use(follow);
router.use(nfts);

module.exports = router;
