const admin = require('firebase-admin');
const { FIRESTORE_USER_ROOT } = require('../../config/config');
const serviceAccount = require('../../config/serviceAccountKey.json');

let database;
if (!process.env.CI) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  database = admin.firestore();
  database.settings({ timestampsInSnapshots: true });
}
const db = database;

const getCollectionIfDefined = root =>
  root ? database.collection(root) : null;

const userCollection = getCollectionIfDefined(FIRESTORE_USER_ROOT);

module.exports = { db, userCollection };
