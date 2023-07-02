const config = {};

const { IS_TESTNET } = process.env;

config.IS_TESTNET = IS_TESTNET === 'TRUE';

config.FIRESTORE_USER_ROOT = process.env.FIRESTORE_USER_ROOT;
config.FIRESTORE_NFT_MINT_SUBSCRIPTION_ROOT =
  process.env.FIRESTORE_NFT_MINT_SUBSCRIPTION_ROOT;
config.FIRESTORE_WALLET_USER_ROOT = process.env.FIRESTORE_WALLET_USER_ROOT;

config.LIKE_CO_CLIENT_ID = process.env.LIKE_CO_CLIENT_ID;
config.LIKE_CO_CLIENT_SECRET = process.env.LIKE_CO_CLIENT_SECRET;

config.COOKIE_SECRET = process.env.COOKIE_SECRET;

config.CRISP_USER_HASH_SECRET = process.env.CRISP_USER_HASH_SECRET;

config.LIKECOIN_CHAIN_API = IS_TESTNET
  ? 'https://node.testnet.like.co'
  : 'https://mainnet-node.like.co';
config.LIKECOIN_API_BASE = IS_TESTNET
  ? 'https://api.rinkeby.like.co'
  : 'https://api.like.co';
config.EXTERNAL_URL = IS_TESTNET
  ? 'https://rinkeby.liker.land'
  : 'https://liker.land';

config.GET_WALLET_API_SECRET = process.env.GET_WALLET_API_SECRET;

module.exports = config;
