const { onMessagePublished } = require('firebase-functions/v2/pubsub');
// const { defineString } = require('firebase-functions/params');
const { getBasicWithAvatarTemplate } = require('@likecoin/edm');
const axios = require('axios').default;

const { db } = require('../modules/firebase');
const { sendEmail } = require('../modules/sendgrid');

const { LIKECOIN_API_BASE, EXTERNAL_URL } = process.env;

function createSubscriptionConfirmURLFactory({
  subscriptionId,
  subscribedWallet,
  subscriberEmail,
}) {
  return (action = 'subscribe') =>
    `${EXTERNAL_URL}/${subscribedWallet}/${action}/${subscriptionId}?email=${encodeURIComponent(
      subscriberEmail
    )}`;
}

// TODO: firebase param does not support `topic` which sucks, hardcode for now
// const topic = defineString('WNFT_PUBSUB_TOPIC');
const topic = 'wnft';

module.exports = onMessagePublished({ topic }, async event => {
  const { message } = event.data;
  const messageBody = message.data
    ? Buffer.from(message.data, 'base64').toString()
    : null;
  if (!messageBody) return null;
  try {
    const data = JSON.parse(messageBody);
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
          const subscriptionId = doc.id;
          const { subscriberEmail, subscribedWallet } = doc.data();
          try {
            let avatar = `https://avatars.dicebear.com/api/identicon/${subscribedWallet}.svg?background=#ffffff`;
            let displayName = subscribedWallet;
            let isSubscribedCivicLiker = false;
            try {
              // eslint-disable-next-line no-await-in-loop
              const res = await axios.get(
                `${LIKECOIN_API_BASE}/users/addr/${subscribedWallet}/min`
              );
              ({ avatar, displayName, isSubscribedCivicLiker } = res.data);
            } catch (err) {
              if (!err.response || err.response.status !== 404) {
                // eslint-disable-next-line no-console
                console.error(err);
              }
            }
            const getSubscriptionConfirmURL = createSubscriptionConfirmURLFactory(
              {
                subscriptionId,
                subscribedWallet,
                subscriberEmail,
              }
            );
            const unsubscribeLink = getSubscriptionConfirmURL('unsubscribe');
            const subject = `Writing NFT - New NFT by ${sellerWallet} is live`;
            const { body } = getBasicWithAvatarTemplate({
              title: 'Writing NFT',
              subtitle: `${displayName}'s new NFT ${classId} is now live`,
              content: `<p>Go to ${EXTERNAL_URL}/nft/class/${classId} to view the new NFT!</p>`,
              avatarURL: avatar,
              isCivicLiker: isSubscribedCivicLiker,
              unsubscribeLink,
              language: 'en',
            });
            // eslint-disable-next-line no-await-in-loop
            await sendEmail({
              email: subscriberEmail,
              subject,
              html: body,
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
