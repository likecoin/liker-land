export const { IS_TESTNET } = process.env;

export const TEST_MODE =
  process.env.NODE_ENV !== 'production' || process.env.CI;

export const ONE_HOUR_IN_MS = 3600000;

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

export const LIKE_CO_THUMBNAIL_FN_BASE = 'https://static.like.co';

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

export const DEFAULT_CL_SUPPORTER =
  process.env.DEFAULT_CL_SUPPORTER || 'foundation';

export const CIVIC_LIKER_UNIT_PRICE = 5;

export const CIVIC_LIKER_CLASSIC_LIKER_ID = 'civic-liker';

export const DEFAULT_AVATAR = 'https://static.like.co/likecoin_de-portrait.jpg';

export const STRIPE_SDK_URL = 'https://js.stripe.com/v3/';

export const CIVIC_LIKER_QUANTITY_OPTIONS = [1];

export const CIVIC_LIKER_V3_STAKING_ENDPOINT = IS_TESTNET
  ? 'https://likecoin-chain-iscn-dev-2.netlify.app/validators/'
  : 'https://stake.like.co/validators/';
