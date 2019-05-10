const functions = require('firebase-functions');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { Nuxt } = require('nuxt-start');

const nuxtConfig = require('../nuxt.config.js');

let debug = false;

if ((functions.config().constant || {}).external_url) {
  process.env.API_URL = functions.config().constant.external_url;
}

if ((functions.config().constant || {}).network === 'rinkeby') {
  process.env.IS_TESTNET = 'TRUE';
  debug = true;
}

if ((functions.config().sentry || {}).report_uri) {
  process.env.SENTRY_REPORT_URI = functions.config().sentry.report_uri;
}

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
app.use(nuxt.render);

module.exports = functions.https.onRequest(app);
