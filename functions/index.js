/* eslint-disable global-require */

const currentFunction = process.env.FUNCTION_NAME || process.env.K_SERVICE;

if (!currentFunction || currentFunction === 'ssrapp') {
  exports.ssrapp = require('./ssrapp');
}

if (!currentFunction || currentFunction === 'api') {
  exports.api = require('./api');
}

if (!currentFunction || currentFunction === 'backup') {
  exports.backup = require('./backup');
}
