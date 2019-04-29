const express = require('express');
const helmet = require('helmet');
const axios = require('axios');
const sharp = require('sharp');
const cors = require('cors');
const { URL } = require('url');

const {
  MAX_THUMB_SIZE = 478,
  ORIGIN_DOMAIN = 'liker.land',
  CLOUD_FN_DOMAIN = 'us-central1-civic-liker.cloudfunctions.net',
  CACHE_TIME_IN_S = 86400,
  IS_TESTNET,
  IS_ENABLE_WEBP,
} = process.env;

const whiteListHostNames = [ORIGIN_DOMAIN, CLOUD_FN_DOMAIN];
const whiteListOrigins = whiteListHostNames.map(
  h => new RegExp(`${h.replace(/\./g, '\\.')}$`)
);
if (IS_TESTNET) {
  whiteListHostNames.push('localhost');
  whiteListOrigins.push(/localhost(:\d*)?$/);
}

const app = express();
app.use(cors({ origin: whiteListOrigins }));
app.use(helmet());
app.get('/', async (req, res) => {
  const { url } = req.query;
  let { width = MAX_THUMB_SIZE } = req.query;
  const { referer, accept = '' } = req.headers;
  if (!url) {
    res.sendStatus(400);
    return;
  }
  if (referer) {
    try {
      const parsedUrl = new URL(referer);
      if (!whiteListHostNames.includes(parsedUrl.hostname)) {
        res.sendStatus(403);
        return;
      }
    } catch (err) {
      res.sendStatus(400);
      return;
    }
  }
  try {
    width = Number(width);
    width = Math.min(width, MAX_THUMB_SIZE);
  } catch (err) {
    width = MAX_THUMB_SIZE;
  }
  try {
    const { data } = await axios({
      method: 'GET',
      url,
      responseType: 'stream',
      timeout: 10000,
    });
    res.set('Cache-Control', `public, max-age=${CACHE_TIME_IN_S}`);
    res.vary('Accept'); // vary cache for accept to allow auto webp serving
    const transformer = sharp();
    let resizer = transformer
      .clone()
      .rotate()
      .resize(width);
    if (IS_ENABLE_WEBP && accept.includes('image/webp')) {
      resizer = resizer.webp();
      res.type('webp');
    } else {
      transformer
        .clone()
        .metadata()
        .then(m => res.type(m.format));
    }
    resizer.pipe(res);
    data.pipe(transformer);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.redirect(url);
  }
});

exports.resizeImageHttp = app;
