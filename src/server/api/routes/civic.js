const axios = require('axios');
const { Router } = require('express');

const { PAYPAL_PDT_HOOK } = require('../../config/config');

const router = Router();

router.post('/civic/payment/paypal', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(403);
      return;
    }
    if (PAYPAL_PDT_HOOK) {
      const { amt, cc, cm, sig, st, tx } = req.body;
      await axios.post(PAYPAL_PDT_HOOK, {
        amt,
        cc,
        cm,
        sig,
        st,
        tx,
      });
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
