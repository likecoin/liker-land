const config = {};

config.IS_TESTNET = process.env.IS_TESTNET;

config.FIRESTORE_USER_ROOT = process.env.FIRESTORE_USER_ROOT;

config.LIKE_CO_CLIENT_ID = process.env.LIKE_CO_CLIENT_ID;
config.LIKE_CO_CLIENT_SECRET = process.env.LIKE_CO_CLIENT_SECRET;

config.COOKIE_SECRET = process.env.COOKIE_SECRET;

config.CRISP_USER_HASH_SECRET = process.env.CRISP_USER_HASH_SECRET;

config.PAYPAL_PDT_HOOK = process.env.PAYPAL_PDT_HOOK;
config.LIKEPAY_HOOK = process.env.LIKEPAY_HOOK;

config.STRIPE_PRIVATE_KEY = process.env.STRIPE_PRIVATE_KEY;
config.STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
config.STRIPE_PLAN_ID = process.env.STRIPE_PLAN_ID;
config.STRIPE_CIVIC_V2_PRICE_ID = process.env.STRIPE_CIVIC_V2_PRICE_ID;

config.EXTERNAL_URL = process.env.EXTERNAL_URL;

module.exports = config;
