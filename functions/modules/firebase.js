const admin = require('firebase-admin');

admin.initializeApp();

const database = admin.firestore();
const db = database;
const { FieldValue } = admin.firestore;

const getCollectionIfDefined = root =>
  root ? database.collection(root) : null;

const userCollection = getCollectionIfDefined(process.env.FIRESTORE_USER_ROOT);
const walletUserCollection = getCollectionIfDefined(
  process.env.FIRESTORE_WALLET_USER_ROOT
);
const nftMintSubscriptionCollection = getCollectionIfDefined(
  process.env.FIRESTORE_NFT_MINT_SUBSCRIPTION_ROOT
);

module.exports = {
  db,
  FieldValue,
  userCollection,
  walletUserCollection,
  nftMintSubscriptionCollection,
};
