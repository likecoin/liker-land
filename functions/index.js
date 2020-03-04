/* eslint-disable global-require */

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'ssrapp') {
  exports.ssrapp = require('./ssrapp');
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'apiHttp') {
  exports.apiHttp = require('./apiHttp');
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'geoipHttp') {
  exports.geoipHttp = require('./geoipHttp');
}
