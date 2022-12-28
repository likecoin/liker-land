const { runWith, config } = require('firebase-functions');
const { getCreatorFollowConfirmationTemplate } = require('@likecoin/edm');

const { sendEmail } = require('../modules/sendgrid');
const { fetchLikerInfoByWallet } = require('../modules/liker');
const { shortenString } = require('../modules/utils');
const {
  convertLanguageCodeForEmailTemplate,
  createSubscriptionConfirmURLFactory,
} = require('../modules/misc');

module.exports = runWith({ secrets: ['SENDGRID_API_KEY'] })
  .firestore.document(
    `${config().db.firestore_nft_mint_subscriptions_root}/{id}`
  )
  .onWrite(async change => {
    if (!change.after || !change.after.data()) {
      return;
    }

    const {
      subscriberEmail,
      subscribedWallet,
      isVerified,
      language = 'en',
    } = change.after.data();
    if (isVerified) {
      return;
    }

    const {
      avatar,
      displayName,
      isSubscribedCivicLiker,
    } = await fetchLikerInfoByWallet(subscribedWallet);

    const subscriptionId = change.after.id;
    const getSubscriptionConfirmURL = createSubscriptionConfirmURLFactory({
      subscriptionId,
      subscribedWallet,
      subscriberEmail,
      language,
    });
    const confirmationLink = getSubscriptionConfirmURL();
    const unsubscribeLink = getSubscriptionConfirmURL('unsubscribe');
    const { subject, body } = getCreatorFollowConfirmationTemplate({
      followerDisplayName: subscriberEmail,
      creatorLikerId: subscribedWallet,
      creatorDisplayName: shortenString(displayName),
      creatorAvatarURL: avatar,
      creatorIsCivicLiker: isSubscribedCivicLiker,
      confirmationLink,
      unsubscribeLink,
      language: convertLanguageCodeForEmailTemplate(language),
    });
    await sendEmail({
      email: subscriberEmail,
      subject,
      html: body,
    });
  });
