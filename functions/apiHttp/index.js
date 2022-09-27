const functions = require('firebase-functions');
const express = require('express');
const helmet = require('helmet');

const api = require('./api');

const app = express();

app.use(helmet());
app.set('trust proxy', 1);
app.use('/api', api);

const internalHttp = functions.region('us-west2').https.onRequest(app);

module.exports = internalHttp;
