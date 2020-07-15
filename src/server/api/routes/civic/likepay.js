const axios = require('axios');
const { Router } = require('express');
const { setPrivateCacheHeader } = require('../../middleware/cache');
const { getLikePayURL } = require('../../util/api');

const { IS_TESTNET, LIKEPAY_HOOK } = require('../../../config/config');

const router = Router();

router.get('/civic/payment/likepay/payment', (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    if (!req.session.user) {
      res.sendStatus(403);
      return;
    }
    const { from } = req.query;
    const url = getLikePayURL({
      amount: IS_TESTNET ? 12 : 15000,
      via: 'foundation',
      to: 'civicpool',
      fee: 0,
      remarks: `civicliker ${req.session.user}`,
      state: from ? JSON.stringify(from) : undefined,
    });
    res.redirect(url);
  } catch (err) {
    next(err);
  }
});

router.post('/civic/payment/likepay', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(403);
      return;
    }
    if (LIKEPAY_HOOK) {
      const { amount, txHash, remarks, referrer, utmSource } = req.body;
      await axios.post(LIKEPAY_HOOK, {
        amount,
        txHash,
        remarks,
        referrer,
        utmSource,
      });
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
