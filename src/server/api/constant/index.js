const { IS_TESTNET } = require('../../config/config');

const AUTH_COOKIE_NAME = '__session';

const AUTH_COOKIE_OPTION = {
  maxAge: 2592000000, // 30days
  secure: process.env.NODE_ENV === 'production',
  // sameSite: 'lax',
  httpOnly: true,
};

const HALF_DAY_IN_S = 43200;
const ONE_DAY_IN_MS = 86400000;

const OAUTH_SCOPE_REQUEST = [
  'profile',
  'email',
  'read:like',
  'civic_liker',
  'bookmarks',
  'follow',
  'preferences',
];

const OAUTH_SCOPE_REQUIRED = [
  'profile',
  'email',
  'read:like',
  'read:civic_liker',
  'write:civic_liker',
  'read:bookmarks',
  'write:bookmarks',
  'read:follow',
  'write:follow',
  'read:preferences',
  'write:preferences',
];

const DEFAULT_FOLLOW_IDS = [
  'foundation',
  'hkcitizennews',
  'inmediahknet',
  'standnews',
  'hi176-matters',
];

const CIVIC_LIKER_QUANTITY_OPTIONS = [1];

const VERIFICATION_EMAIL_RESEND_COOLDOWN_IN_MS = IS_TESTNET ? 60000 : 3600000;

module.exports = {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTION,
  HALF_DAY_IN_S,
  ONE_DAY_IN_MS,
  OAUTH_SCOPE_REQUEST,
  OAUTH_SCOPE_REQUIRED,
  DEFAULT_FOLLOW_IDS,
  CIVIC_LIKER_QUANTITY_OPTIONS,
  VERIFICATION_EMAIL_RESEND_COOLDOWN_IN_MS,
};
