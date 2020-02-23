const axios = require('axios');
const { Router } = require('express');

const { PAYPAL_PDT_HOOK } = require('../../../config/config');
const {
  apiFetchCivicCSOnline,
  apiCivicLikerTrialEventById,
  apiCivicLikerJoinTrialEventById,
} = require('../../util/api');
const stripe = require('./stripe');

const router = Router();

router.use(stripe);

router.get('/civic/csonline', async (req, res, next) => {
  try {
    const { data } = await apiFetchCivicCSOnline(req);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/civic/geoip', async (req, res, next) => {
  const ipCountry = req.headers['x-appengine-country'];
  const ipCity = req.headers['x-appengine-city'];
  const cacheServerName = req.headers['x-forwarded-server'] || '';
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(200).json({
    ipCountry,
    ipCity,
    cacheServerName,
  });
});

router.get('/civic/trial/events/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data } = await apiCivicLikerTrialEventById(id);
    res.json(data);
  } catch (err) {
    // return error format as per API
    if (err.response && err.response.status) {
      const { status, data, statusText } = err.response;
      res.status(status).send(data || statusText);
    } else {
      next(err);
    }
  }
});

router.post('/civic/trial/events/:eventId/join', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(403);
      return;
    }
    const { eventId } = req.params;
    const { data } = await apiCivicLikerJoinTrialEventById(eventId, req);
    res.json(data);
  } catch (err) {
    // return error format as per API
    if (err.response && err.response.status) {
      const { status, data, statusText } = err.response;
      res.status(status).send(data || statusText);
    } else {
      next(err);
    }
  }
});

router.post('/civic/payment/paypal', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(403);
      return;
    }
    if (PAYPAL_PDT_HOOK) {
      const { amt, cc, cm, sig, st, tx, from, referrer, utmSource } = req.body;
      await axios.post(PAYPAL_PDT_HOOK, {
        amt,
        cc,
        cm,
        sig,
        st,
        tx,
        from,
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
