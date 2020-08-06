const functions = require('firebase-functions');
const firestore = require('@google-cloud/firestore');

const client = new firestore.v1.FirestoreAdminClient();

const { bucket } = functions.config().backup;

module.exports = functions.pubsub.schedule('0 18 * * *').onRun(() => {
  const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
  const databaseName = client.databasePath(projectId, '(default)');

  return client
    .exportDocuments({
      name: databaseName,
      outputUriPrefix: bucket,
      collectionIds: [],
    })
    .then(responses => {
      const response = responses[0];
      console.log(`Operation Name: ${response.name}`);
    })
    .catch(err => {
      console.error(err);
      throw new Error('Export operation failed');
    });
});
