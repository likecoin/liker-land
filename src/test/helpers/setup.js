require('browser-env')();
const hooks = require('require-extension-hooks');
const Vue = require('vue'); // eslint-disable-line import/no-extraneous-dependencies

Vue.config.productionTip = false;

hooks('vue')
  .plugin('vue')
  .push();
hooks(['vue', 'js'])
  .plugin('babel')
  .push();
