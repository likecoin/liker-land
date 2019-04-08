const express = require('express');
const helmet = require('helmet');
const axios = require('axios');
const sharp = require('sharp');

const {
  MAX_THUMB_SIZE = 478,
  ORIGIN_DOMAIN = 'liker.land',
  CACHE_TIME_IN_S = 86400,
  IS_TESTNET,
} = process.env;

const app = express();

app.use(helmet());
app.get('/', async (req, res) => {
  const { url } = req.query;
  const { origin, referer } = req.headers;
  if (!IS_TESTNET && origin && !origin.includes(ORIGIN_DOMAIN)) {
    res.sendStatus(403);
    return;
  }
  if (!IS_TESTNET && referer && !referer.includes(ORIGIN_DOMAIN)) {
    res.sendStatus(403);
    return;
  }
  if (!url) {
    res.sendStatus(400);
    return;
  }
  let { width = MAX_THUMB_SIZE } = req.query;
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
    const transformer = sharp();
    transformer
      .clone()
      .metadata()
      .then(m => res.type(m.format));
    transformer
      .clone()
      .resize(width)
      .pipe(res);
    data.pipe(transformer);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    res.redirect(url);
  }
});

exports.resizeImageHttp = app;
