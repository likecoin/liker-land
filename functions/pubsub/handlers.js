const {
  getBasicTemplate,
  getCreatorFollowPublishNewTemplate,
} = require('@likecoin/edm');
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

export async function handleMintEvent(message, data) {
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
    throw new Error(`metadataData is not defined for classId ${classId}`);
  }
  const query = await nftMintSubscriptionCollection
    .where('subscribedWallet', '==', sellerWallet)
    .where('isVerified', '==', true)
    .get();
  const { name, image } = metadataData;
  for (let i = 0; i < query.docs.length; i += 1) {
    const doc = query.docs[i];
    const subscriptionId = doc.id;
    const { subscriberEmail, subscribedWallet, language = 'en' } = doc.data();
    try {
      const {
        avatar,
        displayName,
        isSubscribedCivicLiker,
        // eslint-disable-next-line no-await-in-loop
      } = await fetchLikerInfoByWallet(subscribedWallet);

      const getSubscriptionConfirmURL = createSubscriptionConfirmURLFactory({
        subscriptionId,
        subscribedWallet,
        subscriberEmail,
        language,
      });
      const unsubscribeLink = getSubscriptionConfirmURL('unsubscribe');
      const { subject, body } = getCreatorFollowPublishNewTemplate({
        creatorLikerId: subscribedWallet,
        creatorDisplayName: shortenString(displayName),
        creatorAvatarSrc: avatar,
        creatorIsCivicLiker: isSubscribedCivicLiker,
        followerDisplayName: shortenString(name),
        nftTitle: name,
        nftCoverImageSrc: image,
        nftURL: `${EXTERNAL_URL}/nft/class/${classId}/share?referrer=${subscribedWallet}&utm_source=email`,
        unsubscribeLink,
        language: convertLanguageCodeForEmailTemplate(language),
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
}

export async function handlePurchaseEvent(message, data) {
  const {
    // txHash,
    // iscnId,
    classId,
    nftId,
    nftPrice,
    buyerWallet,
    buyerMemo,
    sellerWallet,
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
    throw new Error(`metadataData is not defined for classId ${classId}`);
  }
  const { name } = metadataData;
  const userDoc = await walletUserCollection.doc(sellerWallet).get();
  const userDocData = userDoc.data();
  if (!userDocData) return;
  // TODO: confirm notification preference format in db.
  const {
    email,
    nofitication: { purchasePrice = false } = {},
    // language = 'en',
  } = userDocData;
  if (email && purchasePrice && nftPrice >= purchasePrice) {
    try {
      const [
        {
          // avatar: buyerAvatar,
          displayName: buyerDisplayName,
          // isSubscribedCivicLiker: buyerIsSubscribedCivicLiker,
        },
        {
          // avatar: sellerAvatar,
          displayName: sellerDisplayName,
          // isSubscribedCivicLiker: sellerIsSubscribedCivicLiker,
        },
        // eslint-disable-next-line no-await-in-loop
      ] = await Promise.all([
        fetchLikerInfoByWallet(buyerWallet),
        fetchLikerInfoByWallet(sellerWallet),
      ]);

      const nftURL = `${EXTERNAL_URL}/nft/class/${classId}/${nftId}?utm_source=email`;

      const { subject, body } = getBasicTemplate({
        subject: `${buyerDisplayName} just bought your Writing NFT ${name}`,
        title: `${buyerDisplayName} just bought your Writing NFT ${name}`,
        body: `Hi ${sellerDisplayName},
${buyerDisplayName} just bought your Writing NFT ${name} just sold for ${nftPrice}.
${buyerMemo ? `Buyer also left a message : ${buyerMemo}` : ''}
View details: ${nftURL}`,
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
}

export async function handleTransferEvent(message, data) {
  const {
    classId,
    // iscnId,
    nftId,
    // txHash,
    // timestamp,
    fromAddress,
    toAddress,
    memo,
  } = data;
  if (!toAddress) {
    throw new Error(
      `toAddress is not defined for message ${message.messageId}`
    );
  }
  const metadataUrl = `${LIKECOIN_API_BASE}/likernft/metadata?class_id=${encodeURIComponent(
    classId
  )}`;
  const { data: metadataData } = await axios.get(metadataUrl);
  if (!metadataData) {
    throw new Error(`metadataData is not defined for classId ${classId}`);
  }
  const { name } = metadataData;
  const userDoc = await walletUserCollection.doc(toAddress).get();
  const userDocData = userDoc.data();
  if (!userDocData) return;
  // TODO: confirm notification preference format in db.
  const {
    email,
    nofitication: { transfer = false } = {},
    // language = 'en',
  } = userDocData;
  if (email && transfer) {
    try {
      const [
        {
          // avatar: toAvatar,
          displayName: toDisplayName,
          // isSubscribedCivicLiker: toIsSubscribedCivicLiker,
        },
        {
          // avatar: fromAvatar,
          displayName: fromDisplayName,
          // isSubscribedCivicLiker: fromIsSubscribedCivicLiker,
        },
        // eslint-disable-next-line no-await-in-loop
      ] = await Promise.all([
        fetchLikerInfoByWallet(toAddress),
        fetchLikerInfoByWallet(fromAddress),
      ]);

      const nftURL = `${EXTERNAL_URL}/nft/class/${classId}/${nftId}?utm_source=email`;

      const { subject, body } = getBasicTemplate({
        subject: `${fromDisplayName} just sent you a Writing NFT ${name}`,
        title: `${fromDisplayName} just sent you a Writing NFT ${name}`,
        body: `Hi ${toDisplayName},
${fromDisplayName} just sent you a Writing NFT ${name}.
${memo ? `Sender also left a message : ${memo}` : ''}
View details: ${nftURL}`,
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
}
