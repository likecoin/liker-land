const axios = require('axios');
const { Router } = require('express');

const { PAYPAL_PDT_HOOK } = require('../../../config/config');
const {
  apiCivicLikerTrialEventById,
  apiCivicLikerJoinTrialEventById,
} = require('../../util/api');
const stripe = require('./stripe');
const likepay = require('./likepay');
const support = require('./support');

const router = Router();

router.use(likepay);
router.use(stripe);
router.use(support);

router.get('/civic/trial/events/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data } = await apiCivicLikerTrialEventById(id);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post('/civic/trial/events/:eventId/join', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const { eventId } = req.params;
    const { data } = await apiCivicLikerJoinTrialEventById(eventId, req);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post('/civic/payment/paypal', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    if (PAYPAL_PDT_HOOK) {
      const {
        amt,
        cc,
        cm,
        sig,
        st,
        tx,
        from,
        referrer,
        utmCampaign,
        utmContent,
        utmMedium,
        utmSource,
        version,
      } = req.body;
      await axios.post(PAYPAL_PDT_HOOK, {
        amt,
        cc,
        cm,
        sig,
        st,
        tx,
        from,
        referrer,
        utmCampaign,
        utmContent,
        utmMedium,
        utmSource,
        version,
      });
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
