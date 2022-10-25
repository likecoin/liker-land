const { firestore, config } = require('firebase-functions');
const { getBasicTemplate } = require('@likecoin/edm');

const { sendEmail } = require('../modules/sendgrid');

const { EXTERNAL_URL } = process.env;

module.exports = firestore
  .document(`${config().db.firestore_nft_mint_subscriptions_root}/{id}`)
  .onCreate(snapshot => {
    const subscriptionId = snapshot.id;
    const { subscriberEmail, subscribedWallet } = snapshot.data();
    const { body } = getBasicTemplate({
      title: 'Writing NFT',
      subtitle: `You have subscribed ${subscribedWallet}`,
      content: `Hi,\nyou will receive email when ${subscribedWallet} create any NFT. You can cancel the subscription by ${EXTERNAL_URL}/${subscribedWallet}/unsubscribe/${subscriptionId}`,
      language: 'en',
    });
    return sendEmail({
      email: subscriberEmail,
      subject: 'Writing NFT - NFT Subscription',
      html: body,
    });
  });
