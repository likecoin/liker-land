const { onMessagePublished } = require('firebase-functions/v2/pubsub');
// const { defineString } = require('firebase-functions/params');
const { getBasicWithAvatarTemplate } = require('@likecoin/edm');
const axios = require('axios').default;

const { nftMintSubscriptionCollection } = require('../modules/firebase');
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

module.exports = onMessagePublished(
  {
    topic,
    secrets: ['SENDGRID_API_KEY'],
  },
  async event => {
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
          if (!sellerWallet) {
            throw new Error(
              `sellerWallet is not defined for message ${message.messageId}`
            );
          }
          const metadataUrl = `${LIKECOIN_API_BASE}/likernft/metadata?class_id=${encodeURIComponent(
            classId
          )}`;
          const { data: metadataData } = await axios.get(metadataUrl);
          if (!metadataData) {
            throw new Error(
              `metadataData is not defined for classId ${classId}`
            );
          }
          const query = await nftMintSubscriptionCollection
            .where('subscribedWallet', '==', sellerWallet)
            .where('isVerified', '==', true)
            .get();
          const { name, image } = metadataData;
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
              const subject = `Writing NFT - New NFT by ${displayName} is live`;
              const { body } = getBasicWithAvatarTemplate({
                title: 'Writing NFT',
                subtitle: `${displayName}'s new NFT ${name} is now live`,
                content: `<p><img style="width: 100%" src="${image}"></p>
<p>${name} is now live!</p>
<p>Go to <a href="${EXTERNAL_URL}/nft/class/${classId}" target="_blank" rel="noreferrer">liker.land</a> to view more details</p>`,
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
  }
);
