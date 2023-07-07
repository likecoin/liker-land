const axios = require('axios');
const HttpAgent = require('agentkeepalive');

const { HttpsAgent } = HttpAgent;
module.exports = axios.create({
  timeout: 60000,
  httpAgent: new HttpAgent(),
  httpsAgent: new HttpsAgent(),
  maxRedirects: 10,
  maxContentLength: 50 * 1000 * 1000,
});
