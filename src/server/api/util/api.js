const {
  IS_TESTNET,
  EXTERNAL_URL: CONFIG_EXTERNAL_URL,
  LIKE_CO_CLIENT_ID,
  LIKE_CO_CLIENT_SECRET,
} = require('../../config/config');

const LIKECOIN_API_BASE = IS_TESTNET
  ? 'https://api.rinkeby.like.co'
  : 'https://api.like.co';
const LIKE_CO_URL_BASE = IS_TESTNET
  ? 'https://rinkeby.like.co'
  : 'https://like.co';
const EXTERNAL_URL =
  CONFIG_EXTERNAL_URL || IS_TESTNET
    ? 'https://civic-liker-develop.firebaseapp.com'
    : 'https://civic-liker.firebaseapp.com';
const OAUTH_REDIRECT_URI = encodeURIComponent(`${EXTERNAL_URL}/redirect`);

const getFetchLikedUserApi = () => `${LIKECOIN_API_BASE}/like/info/liked/list`;
const getFetchUserArticlesAPI = user =>
  `${LIKECOIN_API_BASE}/like/info/user/${user}/latest`;
const getOAuthURL = state =>
  `${LIKE_CO_URL_BASE}/in/oauth?client_id=${LIKE_CO_CLIENT_ID}&redirect_uri=${OAUTH_REDIRECT_URI}&scope=read%3Alike.info&state=${state}`;
const getOAuthCallbackAPI = authCode =>
  `${LIKE_CO_URL_BASE}/api/oauth/access_token?client_id=${LIKE_CO_CLIENT_ID}&client_secret=${LIKE_CO_CLIENT_SECRET}&grant_type=authorization_code&redirect_uri=${OAUTH_REDIRECT_URI}&auth_code=${authCode}`;

module.exports = {
  getFetchLikedUserApi,
  getFetchUserArticlesAPI,
  getOAuthURL,
  getOAuthCallbackAPI,
};
