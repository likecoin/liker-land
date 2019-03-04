const IS_TESTNET = process.env.VUE_APP_IS_TESTNET;
const CLIENT_ID = process.env.VUE_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.VUE_APP_CLIENT_SECRET;

const LIKECOIN_API_BASE = IS_TESTNET
  ? 'https://api.rinkeby.like.co'
  : 'https://api.like.co';
const LIKE_CO_URL_BASE = IS_TESTNET
  ? 'https://rinkeby.like.co'
  : 'https://like.co';
const EXTERNAL_URL = `https://${
  IS_TESTNET ? 'rinkeby-' : ''
}civic-liker.firebaseapp.com`;
const OAUTH_REDIRECT_URI = encodeURIComponent(`${EXTERNAL_URL}/redirect`);

export const getFetchLikedUserApi = () =>
  `${LIKECOIN_API_BASE}/like/info/liked/list`;
export const getFetchUserArticlesAPI = user =>
  `${LIKECOIN_API_BASE}/like/info/user/${user}/latest`;
export const getOAuthURL = () =>
  `${LIKE_CO_URL_BASE}/in/oauth?client_id=${CLIENT_ID}&redirect_uri=${OAUTH_REDIRECT_URI}&scope=read%3Alike.info`;
export const getOAuthCallbackAPI = authCode =>
  `${LIKE_CO_URL_BASE}/api/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=authorization_code&redirect_uri=${OAUTH_REDIRECT_URI}&auth_code=${authCode}`;
