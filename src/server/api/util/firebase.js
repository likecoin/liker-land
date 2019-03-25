const admin = require('firebase-admin');
const { FIRESTORE_USER_ROOT } = require('../../config/config');

let database;
if (!process.env.CI) {
  if (process.env.FIREBASE_CONFIG) {
    admin.initializeApp();
  } else {
    /* eslint-disable-next-line global-require */
    const serviceAccount = require('../../config/serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  database = admin.firestore();
  database.settings({ timestampsInSnapshots: true });
} else {
  database = { collection: () => ({}) };
}
const db = database;
const { FieldValue } = admin.firestore;

const getCollectionIfDefined = root =>
  root ? database.collection(root) : null;

const userCollection = getCollectionIfDefined(FIRESTORE_USER_ROOT);

module.exports = {
  db,
  FieldValue,
  userCollection,
};
