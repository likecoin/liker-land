const { onMessagePublished } = require('firebase-functions/v2/pubsub');
// const { defineString } = require('firebase-functions/params');
const { getCreatorFollowPublishNewTemplate } = require('@likecoin/edm');
const axios = require('axios').default;

const {
  nftMintSubscriptionCollection,
  walletUserCollection,
} = require('../modules/firebase');
const { fetchLikerInfoByWallet } = require('../modules/liker');
const {
  convertLanguageCodeForEmailTemplate,
  createSubscriptionConfirmURLFactory,
} = require('../modules/misc');
const { sendEmail } = require('../modules/sendgrid');
const { shortenString } = require('../modules/utils');

const { LIKECOIN_API_BASE, EXTERNAL_URL } = process.env;

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
          const { name, image } = metadataData;

          const [
            anonymousUserQuerySnapshot,
            walletUserQuerySnapshot,
          ] = await Promise.all([
            nftMintSubscriptionCollection
              .where('subscribedWallet', '==', sellerWallet)
              .where('isVerified', '==', true)
              .get(),
            walletUserCollection
              .where('followees', 'array-contains', sellerWallet)
              .where('email', '>', '')
              .get(),
          ]);
          const {
            avatar,
            displayName,
            isSubscribedCivicLiker,
            // eslint-disable-next-line no-await-in-loop
          } = await fetchLikerInfoByWallet(sellerWallet);

          const recipients = [];
          anonymousUserQuerySnapshot.forEach(doc => {
            const { subscriberEmail, language = 'en' } = doc.data();
            recipients.push({
              email: subscriberEmail,
              language,
              subscriptionId: doc.id,
            });
          });
          walletUserQuerySnapshot.forEach(async doc => {
            const { email, language = 'en' } = doc.data();
            recipients.push({
              email,
              language,
            });
          });

          for (let i = 0; i < recipients.docs.length; i += 1) {
            const { email, language, subscriptionId } = recipients;
            try {
              const getSubscriptionConfirmURL = createSubscriptionConfirmURLFactory(
                {
                  subscriptionId,
                  subscribedWallet: sellerWallet,
                  subscriberEmail: email,
                  language,
                }
              );
              const unsubscribeLink = getSubscriptionConfirmURL('unsubscribe');
              const { subject, body } = getCreatorFollowPublishNewTemplate({
                creatorLikerId: sellerWallet,
                creatorDisplayName: shortenString(displayName),
                creatorAvatarSrc: avatar,
                creatorIsCivicLiker: isSubscribedCivicLiker,
                followerDisplayName: email,
                nftTitle: name,
                nftCoverImageSrc: image,
                nftURL: `${EXTERNAL_URL}/nft/class/${classId}/share?referrer=${sellerWallet}&utm_source=email`,
                unsubscribeLink,
                language: convertLanguageCodeForEmailTemplate(language),
              });
              // eslint-disable-next-line no-await-in-loop
              await sendEmail({
                email,
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
