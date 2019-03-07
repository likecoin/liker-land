const config = {};

config.FIRESTORE_USER_ROOT = process.env.FIRESTORE_USER_ROOT;
config.LIKE_CO_CLIENT_ID = process.env.LIKE_CO_CLIENT_ID;
config.LIKE_CO_CLIENT_SECRET = process.env.LIKE_CO_CLIENT_SECRET;
config.COOKIE_SECRET = process.env.COOKIE_SECRET;

module.exports = config;
