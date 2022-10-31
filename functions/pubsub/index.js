const { onMessagePublished } = require('firebase-functions/v2/pubsub');
// const { defineString } = require('firebase-functions/params');
const { getBasicTemplate } = require('@likecoin/edm');

const { db } = require('../modules/firebase');
const { sendEmail } = require('../modules/sendgrid');

// TODO: firebase param does not support `topic` which sucks, hardcode for now
// const topic = defineString('WNFT_PUBSUB_TOPIC');
const topic = 'wnft';

module.exports = onMessagePublished({ topic }, async event => {
  const { message } = event.data;
  console.log(event.data);
  console.log(message);
  try {
    const data = JSON.parse(message.data.toString());
    const { type } = data;
    switch (type) {
      case 'mint': {
        const {
          classId,
          // iscnId,
          // txHash,
          // nftCount,
          sellerWallet,
          // uri,
        } = data;
        const emailRef = db.collection(
          process.env.FIRESTORE_NFT_MINT_SUBSCRIPTION_ROOT
        );
        const query = await emailRef
          .where('subscribedWallet', '==', sellerWallet)
          .get();
        for (let i = 0; i < query.docs.length; i += 1) {
          const doc = query.docs[i];
          const { subscriberEmail } = doc.data();
          try {
            // eslint-disable-next-line no-await-in-loop
            await sendEmail({
              email: subscriberEmail,
              subject: `Writing NFT - New NFT by ${sellerWallet}`,
              html: getBasicTemplate({
                title: `New NFT Created by ${sellerWallet}`,
                subtitle: `${classId} is now live`,
                content: `Go to ${
                  process.env.EXTERNAL_URL
                }/nft/class/${classId} to find out more`,
              }),
            });
          } catch (err) {
            console.error(err);
          }
        }
        break;
      }
      default:
    }
  } catch (err) {
    console.error(err);
  }
  return null;
});
