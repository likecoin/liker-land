const { Router } = require('express');

const auth = require('./auth');
const follow = require('./follow');
const nfts = require('./nfts');

const router = Router();

router.use(auth);
router.use(follow);
router.use(nfts);

module.exports = router;
