const { firestore, config } = require('firebase-functions');
const { getBasicWithAvatarTemplate } = require('@likecoin/edm');
const axios = require('axios').default;

const { sendEmail } = require('../modules/sendgrid');

const { EXTERNAL_URL, LIKECOIN_API_BASE } = process.env;

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

module.exports = firestore
  .document(`${config().db.firestore_nft_mint_subscriptions_root}/{id}`)
  .onCreate(async snapshot => {
    const subscriptionId = snapshot.id;
    const { subscriberEmail, subscribedWallet } = snapshot.data();

    let avatar = `https://avatars.dicebear.com/api/identicon/${subscribedWallet}.svg?background=#ffffff`;
    let displayName = subscribedWallet;
    let isSubscribedCivicLiker = false;
    try {
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

    const getSubscriptionConfirmURL = createSubscriptionConfirmURLFactory({
      subscriptionId,
      subscribedWallet,
      subscriberEmail,
    });
    const confirmLink = getSubscriptionConfirmURL();
    const unsubscribeLink = getSubscriptionConfirmURL('unsubscribe');
    const { body } = getBasicWithAvatarTemplate({
      title: 'Writing NFT',
      subtitle: `Subscribe ${displayName}'s Writing NFT`,
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
