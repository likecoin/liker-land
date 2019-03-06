const IS_TESTNET = process.env.IS_TESTNET; // eslint-disable-line prefer-destructuring
const ENV_EXTERNAL_URL = process.env.EXTERNAL_URL;
const CLIENT_ID = process.env.LIKE_CO_CLIENT_ID;
const CLIENT_SECRET = process.env.LIKE_CO_CLIENT_SECRET;

const LIKECOIN_API_BASE = IS_TESTNET
  ? 'https://api.rinkeby.like.co'
  : 'https://api.like.co';
const LIKE_CO_URL_BASE = IS_TESTNET
  ? 'https://rinkeby.like.co'
  : 'https://like.co';
const EXTERNAL_URL =
  ENV_EXTERNAL_URL || IS_TESTNET
    ? 'https://civic-liker-develop.firebaseapp.com'
    : 'https://civic-liker.firebaseapp.com';
const OAUTH_REDIRECT_URI = encodeURIComponent(`${EXTERNAL_URL}/redirect`);

const getFetchLikedUserApi = () => `${LIKECOIN_API_BASE}/like/info/liked/list`;
const getFetchUserArticlesAPI = user =>
  `${LIKECOIN_API_BASE}/like/info/user/${user}/latest`;
const getOAuthCallbackAPI = authCode =>
  `${LIKE_CO_URL_BASE}/api/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=authorization_code&redirect_uri=${OAUTH_REDIRECT_URI}&auth_code=${authCode}`;

module.exports = {
  getFetchLikedUserApi,
  getFetchUserArticlesAPI,
  getOAuthCallbackAPI,
};
