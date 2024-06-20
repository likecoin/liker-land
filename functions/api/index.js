const { onRequest } = require('firebase-functions/v2/https');
const express = require('express');
const helmet = require('helmet');

const api = require('./api');

const app = express();

app.use(helmet());
app.set('trust proxy', 1);
app.use('/api', api);

module.exports = onRequest(
  {
    secrets: [
      'LIKE_CO_CLIENT_ID',
      'LIKE_CO_CLIENT_SECRET',
      'COOKIE_SECRET',
      'CRISP_USER_HASH_SECRET',
      'SENDGRID_API_KEY',
      'GET_WALLET_API_SECRET',
      'AIRTABLE_API_SECRET',
    ],
    region: ['us-west1'],
  },
  app
);
