const functions = require('firebase-functions');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { Nuxt } = require('nuxt-start');

const debug = process.env.IS_TESTNET === 'TRUE';

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

module.exports = functions.region('us-west2').https.onRequest(app);
