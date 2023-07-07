const {
  getCreatorFollowPublishNewTemplate,
  getNFTNotificationTransferTemplate,
  getNFTNotificationPurchaseTemplate,
  getNFTNotificationPurchaseMultipleTemplate,
} = require('@likecoin/edm');
const Axios = require('axios');
const HttpAgent = require('agentkeepalive');

const { HttpsAgent } = HttpAgent;

const axios = Axios.create({
  timeout: 60000,
  httpAgent: new HttpAgent(),
  httpsAgent: new HttpsAgent(),
  maxRedirects: 10,
  maxContentLength: 50 * 1000 * 1000,
});


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

const {
  LIKECOIN_API_BASE,
  EXTERNAL_URL,
  ARWEAVE_ENDPOINT,
  IPFS_VIEW_GATEWAY_URL,
} = process.env;

const TX_UNSUBSCRIBE_LINK = `${EXTERNAL_URL}/settings/email?utm_source=email`;

async function fetchNFTMetadata(classId) {
  const metadataUrl = `${LIKECOIN_API_BASE}/likernft/metadata?class_id=${encodeURIComponent(
    classId
  )}`;
  const { data: metadataData } = await axios.get(metadataUrl);
  if (!metadataData) {
    throw new Error(`metadataData is not defined for classId ${classId}`);
  }
  return metadataData;
}

function getNFTURL(classId, nftId = '') {
  return `${EXTERNAL_URL}/nft/class/${classId}/${nftId}?utm_source=email`;
}

function normalizeURLToHTTP(url) {
  const [schema, path] = url.split('://');
  if (schema === 'ar') return `${ARWEAVE_ENDPOINT}/${path}`;
  if (schema === 'ipfs') return `${IPFS_VIEW_GATEWAY_URL}/${path}`;
  return url;
}

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

  const { name, image } = await fetchNFTMetadata(classId);

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

  let recipients = [];
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

  // dedup
  recipients = [...new Map(recipients.map(r => [r.email, r])).values()];

  for (let i = 0; i < recipients.length; i += 1) {
    const { email, language, subscriptionId } = recipients[i];
    try {
      const getSubscriptionConfirmURL = createSubscriptionConfirmURLFactory({
        subscriptionId,
        subscribedWallet: sellerWallet,
        subscriberEmail: email,
        language,
      });
      const unsubscribeLink = getSubscriptionConfirmURL('unsubscribe');
      const { subject, body } = getCreatorFollowPublishNewTemplate({
        creatorLikerId: sellerWallet,
        creatorDisplayName: shortenString(displayName),
        creatorAvatarSrc: avatar,
        creatorIsCivicLiker: isSubscribedCivicLiker,
        followerDisplayName: email,
        nftTitle: name,
        nftCoverImageSrc: normalizeURLToHTTP(image),
        nftURL: getNFTURL(classId),
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

  const { name, image } = await fetchNFTMetadata(classId);

  const userDoc = await walletUserCollection.doc(sellerWallet).get();
  const userDocData = userDoc.data();
  if (!userDocData) return;

  const {
    email,
    notification: { purchasePrice = 0 } = {},
    locale = 'en',
  } = userDocData;

  if (email && purchasePrice >= 0 && nftPrice >= purchasePrice) {
    try {
      const [
        {
          likerId: buyerLikerId,
          avatar: buyerAvatarSrc,
          displayName: buyerDisplayName,
          isSubscribedCivicLiker: buyerIsCivicLiker,
        },
        { displayName: sellerDisplayName },
        // eslint-disable-next-line no-await-in-loop
      ] = await Promise.all([
        fetchLikerInfoByWallet(buyerWallet),
        fetchLikerInfoByWallet(sellerWallet),
      ]);

      const { subject, body } = getNFTNotificationPurchaseTemplate({
        followerDisplayName: sellerDisplayName,
        unsubscribeLink: TX_UNSUBSCRIBE_LINK,
        buyerLikerId,
        buyerDisplayName,
        buyerAvatarSrc,
        buyerIsCivicLiker,
        priceInLIKE: nftPrice,
        message: buyerMemo,
        nftTitle: name,
        nftCoverImageSrc: normalizeURLToHTTP(image),
        nftURL: getNFTURL(classId, nftId),
        language: convertLanguageCodeForEmailTemplate(locale),
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

export async function handlePurchaseMultipleEvent(message, data) {
  const {
    // txHash,
    buyerWallet,
    buyerMemo: buyerMessage,
    items,
  } = data;

  const txDataMapBySeller = {};
  items.forEach(itemData => {
    const { sellerWallet } = itemData;
    if (!sellerWallet) return;

    if (!txDataMapBySeller[sellerWallet]) {
      txDataMapBySeller[sellerWallet] = {
        items: [],
        totalNFTPrice: 0,
      };
    }
    txDataMapBySeller[sellerWallet].items.push(itemData);
    txDataMapBySeller[sellerWallet].totalNFTPrice += itemData.nftPrice;
  });

  // Gather all sellers need to be notified
  const sellerList = await Promise.all(
    Object.keys(txDataMapBySeller).map(async sellerWallet => {
      try {
        const userDoc = await walletUserCollection.doc(sellerWallet).get();
        const sellerUserData = userDoc.data();
        return [sellerWallet, sellerUserData];
      } catch {
        return [sellerWallet];
      }
    })
  );
  let sellerListToNotify = sellerList.filter(
    ([sellerWallet, sellerUserData]) => {
      if (!sellerUserData) return false;
      const {
        email,
        notification: { purchasePrice = 0 } = {},
      } = sellerUserData;
      return (
        email &&
        purchasePrice >= 0 &&
        txDataMapBySeller[sellerWallet].totalNFTPrice >= purchasePrice
      );
    }
  );
  if (sellerListToNotify.length === 0) return;

  // Fetch liker info of buyer and sellers
  const fetchSellerLikerInfoPromises = sellerListToNotify.map(
    async ([sellerWallet, sellerUserData]) => {
      const sellerData = {
        txData: txDataMapBySeller[sellerWallet],
        userData: sellerUserData,
      };
      try {
        sellerData.likerInfo = await fetchLikerInfoByWallet(sellerWallet);
      } catch {
        // No-op
      }
      return [sellerWallet, sellerData];
    }
  );
  const [
    {
      likerId: buyerLikerID,
      avatar: buyerAvatarSrc,
      displayName: buyerDisplayName,
      isSubscribedCivicLiker: buyerIsCivicLiker,
    },
    ...fetchSellerLikerInfoResults
  ] = await Promise.all([
    fetchLikerInfoByWallet(buyerWallet).catch(() => {}),
    ...fetchSellerLikerInfoPromises,
  ]);
  sellerListToNotify = fetchSellerLikerInfoResults;

  // Fetch NFT class data
  const nftClassIds = new Set();
  sellerListToNotify.forEach(([sellerWallet]) => {
    txDataMapBySeller[sellerWallet].items.forEach(itemData => {
      nftClassIds.add(itemData.classId);
    });
  });
  const fetchNFTClassPromises = [...nftClassIds].map(async classId => {
    try {
      const nftClassData = await fetchNFTMetadata(classId);
      return [classId, nftClassData];
    } catch {
      return [classId];
    }
  });
  const nftClassDataList = await Promise.all(fetchNFTClassPromises);
  const nftClassDataMap = new Map(nftClassDataList);

  await Promise.all(
    sellerListToNotify.map(async ([, sellerData]) => {
      try {
        const {
          txData: { items: nftItems, totalNFTPrice } = {},
          userData: { email, locale = 'en' } = {},
          likerInfo: {
            likerId: sellerLikerID,
            avatar: sellerAvatarSrc,
            displayName: sellerDisplayName,
            isSubscribedCivicLiker: sellerIsCivicLiker,
          } = {},
        } = sellerData;

        const purchasedItems = nftItems.map(({ classId, nftId, nftPrice }) => {
          const { name, image } = nftClassDataMap.get(classId) || {};
          return {
            title: name,
            coverImageSrc: normalizeURLToHTTP(image),
            url: getNFTURL(classId, nftId),
            priceInLIKE: nftPrice,
          };
        });

        const { subject, body } = getNFTNotificationPurchaseMultipleTemplate({
          language: convertLanguageCodeForEmailTemplate(locale),
          unsubscribeLink: TX_UNSUBSCRIBE_LINK,
          sellerLikerID,
          sellerAvatarSrc,
          sellerDisplayName,
          sellerIsCivicLiker,
          buyerLikerID,
          buyerDisplayName,
          buyerAvatarSrc,
          buyerIsCivicLiker,
          buyerMessage,
          purchasedItems,
          totalPriceInLIKE: totalNFTPrice,
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
    })
  );
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

  const { name, image } = await fetchNFTMetadata(classId);

  const userDoc = await walletUserCollection.doc(toAddress).get();
  const userDocData = userDoc.data();
  if (!userDocData) return;

  const {
    email,
    notification: { transfer = true } = {},
    locale = 'en',
  } = userDocData;

  if (email && transfer) {
    try {
      const [
        { displayName: toDisplayName },
        {
          likerId: fromLikerId,
          avatar: fromAvatar,
          displayName: fromDisplayName,
          isSubscribedCivicLiker: fromIsSubscribedCivicLiker,
        },
        // eslint-disable-next-line no-await-in-loop
      ] = await Promise.all([
        fetchLikerInfoByWallet(toAddress),
        fetchLikerInfoByWallet(fromAddress),
      ]);

      const { subject, body } = getNFTNotificationTransferTemplate({
        followerDisplayName: toDisplayName,
        unsubscribeLink: TX_UNSUBSCRIBE_LINK,
        senderLikerId: fromLikerId,
        senderDisplayName: fromDisplayName,
        senderAvatarSrc: fromAvatar,
        senderIsCivicLiker: fromIsSubscribedCivicLiker,
        message: memo,
        nftTitle: name,
        nftCoverImageSrc: normalizeURLToHTTP(image),
        nftURL: getNFTURL(classId, nftId),
        language: convertLanguageCodeForEmailTemplate(locale),
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
