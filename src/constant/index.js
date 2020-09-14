export const { IS_TESTNET } = process.env;

export const TEST_MODE =
  process.env.NODE_ENV !== 'production' || process.env.CI;

export const LIKECOIN_API_BASE = IS_TESTNET
  ? 'https://api.rinkeby.like.co'
  : 'https://api.like.co';

export const LIKE_CO_URL_BASE = IS_TESTNET
  ? 'https://rinkeby.like.co'
  : 'https://like.co';

export const LIKECOIN_BUTTON_BASE = IS_TESTNET
  ? 'https://button.rinkeby.like.co'
  : 'https://button.like.co';

export const SUPERLIKE_BASE = IS_TESTNET
  ? 'https://s.rinkeby.like.co'
  : 'https://s.like.co';

export const LIKE_CO_CLOUD_FN_BASE = `https://us-central1-civic-liker${
  IS_TESTNET ? '-develop' : ''
}.cloudfunctions.net`;

export const LIKECOIN_LOGOUT_POPUP_URL = IS_TESTNET
  ? 'https://rinkeby.like.co/in/logout?is_popup=1'
  : 'https://like.co/in/logout?is_popup=1';

export const AUTH_COOKIE_NAME = '__session';

export const PAYMENT_METHOD_LIST = [
  'stripe',
  'paypal',
  'likepay',
  'other', // plz always put `other` at last for hk geoip handle
];
