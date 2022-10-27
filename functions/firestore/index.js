const { firestore, config } = require('firebase-functions');
const { getBasicWithAvatarTemplate } = require('@likecoin/edm');
const axios = require('axios').default;

const { sendEmail } = require('../modules/sendgrid');

const { EXTERNAL_URL, LIKECOIN_API_BASE } = process.env;

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

    const unsubscribeLink = `${EXTERNAL_URL}/${subscribedWallet}/unsubscribe/${subscriptionId}`;
    const { body } = getBasicWithAvatarTemplate({
      title: 'Writing NFT',
      subtitle: `You have subscribed ${displayName}`,
      content: `<p>Hi,</p>
      <p>You will receive email when <b>${displayName}</b> create any Writing NFT.
      You can cancel the subscription by <a href="${unsubscribeLink}" target="_blank" rel="noreferrer">${unsubscribeLink}</a>.</p>`,
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
