const { runWith, config } = require('firebase-functions');
const { getBasicWithAvatarTemplate } = require('@likecoin/edm');

const { sendEmail } = require('../modules/sendgrid');
const { fetchLikerInfoByWallet } = require('../modules/liker');
const { shortenString } = require('../modules/utils');

const { EXTERNAL_URL } = process.env;

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

module.exports = runWith({ secrets: ['SENDGRID_API_KEY'] })
  .firestore.document(
    `${config().db.firestore_nft_mint_subscriptions_root}/{id}`
  )
  .onCreate(async snapshot => {
    const subscriptionId = snapshot.id;
    const { subscriberEmail, subscribedWallet } = snapshot.data();

    const {
      avatar,
      displayName,
      isSubscribedCivicLiker,
    } = await fetchLikerInfoByWallet(subscribedWallet);

    const getSubscriptionConfirmURL = createSubscriptionConfirmURLFactory({
      subscriptionId,
      subscribedWallet,
      subscriberEmail,
    });
    const confirmLink = getSubscriptionConfirmURL();
    const unsubscribeLink = getSubscriptionConfirmURL('unsubscribe');
    const { body } = getBasicWithAvatarTemplate({
      title: 'Writing NFT',
      subtitle: `Subscribe ${shortenString(displayName)}'s Writing NFT`,
      content: `<p>Hi,</p>
      <p>Please <a href="${confirmLink}" target="_blank" rel="noreferrer">click here</a> or the link below to confirm your subscription of ${displayName}'s Writing NFT.</p>
      <p><a href="${confirmLink}" target="_blank" rel="noreferrer">${confirmLink}</a></p>`,
      avatarURL: avatar,
      isCivicLiker: isSubscribedCivicLiker,
      unsubscribeLink,
      language: 'en',
    });
    return sendEmail({
      email: subscriberEmail,
      subject: 'Writing NFT - NFT Subscription',
      html: body,
    });
  });
