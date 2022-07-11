const functions = require('firebase-functions');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { Nuxt } = require('nuxt-start');

let debug = false;

if ((functions.config().constant || {}).api_url) {
  process.env.API_URL = functions.config().constant.api_url;
}

if ((functions.config().constant || {}).network === 'rinkeby') {
  process.env.IS_TESTNET = 'TRUE';
  debug = true;
}

if ((functions.config().sentry || {}).report_uri) {
  process.env.SENTRY_REPORT_URI = functions.config().sentry.report_uri;
}

const nuxtConfig = require('../nuxt.config');

const config = {
  ...nuxtConfig,
  debug,
  dev: false,
  buildDir: 'nuxt',
};

const nuxt = new Nuxt(config);

const app = express();
app.use(helmet());
app.use(cookieParser());
app.use(async (req, res) => {
  await nuxt.ready();
  nuxt.render(req, res);
});

module.exports = functions.https.onRequest(app);
