const functions = require('firebase-functions');
const express = require('express');
const helmet = require('helmet');
const { Nuxt } = require('nuxt-start');

const nuxtConfig = require('../nuxt.config.js');

const config = {
  ...nuxtConfig,
  dev: false,
  buildDir: 'nuxt',
};
const nuxt = new Nuxt(config);

const app = express();
app.use(helmet());
app.use(nuxt.render);

module.exports = functions.https.onRequest(app);
