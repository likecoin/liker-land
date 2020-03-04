const functions = require('firebase-functions');
const express = require('express');
const helmet = require('helmet');
const requestIp = require('request-ip');
const geoip = require('geoip-country');

const app = express();
app.use(helmet());
app.get('/api/geoip', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  try {
    const result = geoip.lookup(
      req.headers['fastly-client-ip'] || requestIp.getClientIp(req)
    );
    res.json({ country: result.country });
  } catch (err) {
    console.error(err);
    res.json({});
  }
});

module.exports = functions.https.onRequest(app);
