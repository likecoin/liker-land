const config = {};

config.IS_TESTNET = process.env.IS_TESTNET;

config.FIRESTORE_USER_ROOT = process.env.FIRESTORE_USER_ROOT;

config.LIKE_CO_CLIENT_ID = process.env.LIKE_CO_CLIENT_ID;
config.LIKE_CO_CLIENT_SECRET = process.env.LIKE_CO_CLIENT_SECRET;

config.COOKIE_SECRET = process.env.COOKIE_SECRET;

config.PAYPAL_PDT_HOOK = process.env.PAYPAL_PDT_HOOK;

config.EXTERNAL_URL = process.env.EXTERNAL_URL;

module.exports = config;
