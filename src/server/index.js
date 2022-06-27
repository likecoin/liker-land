const express = require('express');
const cookieParser = require('cookie-parser');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const api = require('./api');

const app = express();

// Import and Set Nuxt.js options
const config = require('../nuxt.config');

config.dev = !(process.env.NODE_ENV === 'production');

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000,
  } = nuxt.options.server;

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  } else {
    await nuxt.ready();
  }

  app.use('/api', api);
  app.use(cookieParser());
  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  });
}
start();
