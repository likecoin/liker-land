const AUTH_COOKIE_NAME = '__session';

const AUTH_COOKIE_OPTION = {
  maxAge: 2592000000, // 30days
  secure: process.env.NODE_ENV === 'production',
  // sameSite: 'lax',
  httpOnly: true,
};

const DEFAULT_FOLLOW_IDS = [
  'foundation',
  'hkcitizennews',
  'inmediahknet',
  'standnews',
];

const OAUTH_SCOPE_REQUEST = [
  'profile',
  'email',
  'read:like.info',
  'civic_liker',
  'bookmarks',
  'follow',
];

const OAUTH_SCOPE_REQUIRED = [
  'profile',
  'email',
  'read:like.info',
  'read:civic_liker',
  'write:civic_liker',
  'read:bookmarks',
  'write:bookmarks',
  'read:follow',
  'write:follow',
];

module.exports = {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTION,
  DEFAULT_FOLLOW_IDS,
  OAUTH_SCOPE_REQUEST,
  OAUTH_SCOPE_REQUIRED,
};
