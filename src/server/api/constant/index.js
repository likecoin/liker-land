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

module.exports = {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTION,
  DEFAULT_FOLLOW_IDS,
};
