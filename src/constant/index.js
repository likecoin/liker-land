const IS_TESTNET = process.env.VUE_APP_IS_TESTNET;
const CLIENT_ID = process.env.VUE_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.VUE_APP_CLIENT_SECRET;

export const API_BASE = IS_TESTNET ? 'https://api.rinkeby.like.co' : 'https://api.like.co';
export const URL_BASE = IS_TESTNET ? 'https://rinkeby.like.co' : 'https://like.co';
export const OAUTH_REDIRECT_URI = encodeURIComponent(`https://${IS_TESTNET ? 'rinkeby-' : ''}civic-liker.firebaseapp.com/#/redirect`);
export const OAUTH_LOGIN_URL = `${URL_BASE}/in/oauth?client_id=${CLIENT_ID}&redirect_uri=${OAUTH_REDIRECT_URI}&scope=read%3Alike.info`;
export const OAUTH_CALLBACK_URL = `${URL_BASE}/api/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${OAUTH_REDIRECT_URI}&auth_code=`;
