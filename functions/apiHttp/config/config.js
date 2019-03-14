const functions = require('firebase-functions');

const config = {};

config.IS_TESTNET = functions.config().constant.network === 'rinkeby';
if (config.IS_TESTNET) process.env.IS_TESTNET = 'TRUE';

config.FIRESTORE_USER_ROOT = functions.config().db.FIRESTORE_USER_ROOT;

config.LIKE_CO_CLIENT_ID = functions.config().likeco_oauth.clientid;
config.LIKE_CO_CLIENT_SECRET = functions.config().likeco_oauth.secret;

config.COOKIE_SECRET = functions.config().cookie.secret;

config.PAYPAL_PDT_HOOK = functions.config().hook.paypal_pdt;

config.EXTERNAL_URL = functions.config().constant.external_url;

module.exports = config;
