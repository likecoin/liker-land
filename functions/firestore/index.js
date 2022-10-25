const { firestore, config } = require('firebase-functions');

const { sendEmail } = require('../modules/sendgrid');

const { EXTERNAL_URL } = process.env;

module.exports = firestore
  .document(`${config().db.firestore_nft_mint_subscriptions_root}/{id}`)
  .onCreate(snapshot => {
    const subscriptionId = snapshot.id;
    const { subscriberEmail, subscribedWallet } = snapshot.data();
    return sendEmail({
      email: subscriberEmail,
      subject: 'Writing NFT - NFT Subscription',
      html: `Hi you have subscribed ${subscribedWallet}, you can cancel the subscription by ${EXTERNAL_URL}/${subscribedWallet}/unsubscribe/${subscriptionId}`,
    });
  });
