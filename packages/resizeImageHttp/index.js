const express = require('express');
const helmet = require('helmet');
const axios = require('axios');
const sharp = require('sharp');
const { URL } = require('url');

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
  const { referer } = req.headers;
  if (referer) {
    try {
      const parsedUrl = new URL(referer);
      const whiteListHostNames = [ORIGIN_DOMAIN];
      if (IS_TESTNET) whiteListHostNames.push('localhost');
      if (!whiteListHostNames.includes(parsedUrl.hostname)) {
        res.sendStatus(403);
        return;
      }
    } catch (err) {
      res.sendStatus(400);
      return;
    }
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
