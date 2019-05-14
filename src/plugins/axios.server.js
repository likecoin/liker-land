const http = require('http');
const https = require('https');

export default ({ $axios }) => {
  /* eslint-disable no-param-reassign */
  $axios.defaults.timeout = 20000;
  $axios.defaults.httpAgent = new http.Agent({ keepAlive: true });
  $axios.defaults.httpsAgent = new https.Agent({ keepAlive: true });
  /* eslint-enable no-param-reassign */
};
