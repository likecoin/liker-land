const { Router } = require('express');

const auth = require('./auth');
const cart = require('./cart');
const email = require('./email');
const event = require('./event');
const follow = require('./follow');
const locale = require('./locale');
const nfts = require('./nfts');
const notification = require('./notification');
const reader = require('./reader');
const wallet = require('./wallet');

const router = Router();

router.use(auth);
router.use(cart);
router.use(email);
router.use(event);
router.use(follow);
router.use(locale);
router.use(nfts);
router.use(reader);
router.use(notification);
router.use(wallet);

module.exports = router;
