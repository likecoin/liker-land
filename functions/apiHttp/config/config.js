const functions = require('firebase-functions');

const config = {};

config.IS_TESTNET = functions.config().constant.network === 'rinkeby';
if (config.IS_TESTNET) process.env.IS_TESTNET = 'TRUE';

config.FIRESTORE_USER_ROOT = functions.config().db.FIRESTORE_USER_ROOT;

config.LIKE_CO_CLIENT_ID = functions.config().likeco_oauth.clientid;
config.LIKE_CO_CLIENT_SECRET = functions.config().likeco_oauth.secret;

config.COOKIE_SECRET = functions.config().cookie.secret;

config.CRISP_USER_HASH_SECRET = functions.config().crisp.user_hash_secret;

config.PAYPAL_PDT_HOOK = functions.config().hook.paypal_pdt;

config.LIKEPAY_HOOK = functions.config().hook.likepay;

config.STRIPE_PRIVATE_KEY = functions.config().stripe.private_key;
config.STRIPE_WEBHOOK_SECRET = functions.config().stripe.webhook_secret;
config.STRIPE_PLAN_ID = functions.config().stripe.plan_id;
config.STRIPE_CIVIC_V2_PRICE_ID = functions.config().stripe.civic_v2_price_id;

config.EXTERNAL_URL = functions.config().constant.external_url;

module.exports = config;
