const { IS_TESTNET } = process.env;
const CLIENT_ID = process.env.LIKE_CO_CLIENT_ID;

const LIKE_CO_URL_BASE = IS_TESTNET
  ? 'https://rinkeby.like.co'
  : 'https://like.co';
const EXTERNAL_URL = `http://localhost:3000`;
const OAUTH_REDIRECT_URI = encodeURIComponent(`${EXTERNAL_URL}/redirect`);

export const getFetchLikedUserApi = () => `/api/reader/index`;
export const getFetchUserArticlesAPI = user => `/api/reader/user/${user}`;
export const getOAuthURL = () =>
  `${LIKE_CO_URL_BASE}/in/oauth?client_id=${CLIENT_ID}&redirect_uri=${OAUTH_REDIRECT_URI}&scope=read%3Alike.info`;
export const getOAuthCallbackAPI = authCode => `/api/users/login`;
