const { onSchedule } = require('firebase-functions/v2/scheduler');
const firestore = require('@google-cloud/firestore');

const client = new firestore.v1.FirestoreAdminClient();

const bucket = process.env.BACKUP_BUCKET;

module.exports = onSchedule(
  {
    region: ['us-west1'],
    schedule: '0 18 * * *',
  },
  () => {
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
  }
);
