/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
} else if (
  typeof window !== 'undefined' &&
  typeof window.TextEncoder === 'undefined'
) {
  window.TextEncoder = require('util').TextEncoder;
  window.TextDecoder = require('util').TextDecoder;
}

if (typeof global.AbortController === 'undefined') {
  global.AbortController = require('abort-controller');
}

if (typeof global.Request === 'undefined') {
  global.Request = require('node-fetch').Request;
}
