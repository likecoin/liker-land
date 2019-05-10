export const { IS_TESTNET } = process.env;

export const TEST_MODE =
  process.env.NODE_ENV !== 'production' || process.env.CI;

export const LIKECOIN_API_BASE = IS_TESTNET
  ? 'https://api.rinkeby.like.co'
  : 'https://api.like.co';

export const LIKE_CO_URL_BASE = IS_TESTNET
  ? 'https://rinkeby.like.co'
  : 'https://like.co';

export const LIKE_CO_CLOUD_FN_BASE = `https://us-central1-civic-liker${
  IS_TESTNET ? '-develop' : ''
}.cloudfunctions.net`;

export const AUTH_COOKIE_NAME = '__session';
