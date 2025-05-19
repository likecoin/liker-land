import querystring from 'querystring';
import {
  CIVIC_LIKER_CLASSIC_LIKER_ID,
  EXTERNAL_HOST,
  LIKECOIN_API_BASE,
  LIKE_CO_THUMBNAIL_FN_BASE,
  NFT_BOOK_PLATFORM_LIKER_LAND,
  BOOKSTORE_LIST_EXCLUDED_WALLET,
  BOOKSTORE_CMS_CACHE_RESET_TIMESTAMP,
} from '../../constant';
import { normalizeLocaleForLikeCo } from '../../locales';

export const getOAuthRegisterAPI = ({
  language = 'zh',
  from = '',
  referrer = '',
  utmSource = '',
} = {}) =>
  `/api/users/register?${querystring.stringify({
    language: normalizeLocaleForLikeCo(language),
    from,
    referrer,
    utm_source: utmSource,
  })}`;
export const getOAuthLoginAPI = ({ language = 'zh', utmSource } = {}) =>
  `/api/users/login?${querystring.stringify({
    language: normalizeLocaleForLikeCo(language),
    utm_source: utmSource,
  })}`;
export const getOAuthCallbackAPI = () => `/api/users/login`;
export const getLoginStatus = () => `/api/users/self`;
export const getLogoutAPI = () => `/api/users/logout`;
export const getCivicLikerStakingAPI = address =>
  `/api/civic/staking?address=${address}`;
export const getCivicLikerStakingInfoAPI = () => '/api/civic/staking/info';

export const getImageResizeAPI = (url, { width } = {}) =>
  `${LIKE_CO_THUMBNAIL_FN_BASE}/thumbnail/?url=${encodeURIComponent(url)}${
    width ? `&width=${width}` : ''
  }`;
export const getUserMinAPI = (id, { types = [] } = {}) =>
  `${LIKECOIN_API_BASE}/users/id/${id}/min?${querystring.stringify({
    type: types.join(','),
  })}`;
export const getUserInfoMinByAddress = addr =>
  `${LIKECOIN_API_BASE}/users/addr/${addr}/min`;
export const getArticleDetailAPI = ({ url = '', iscnId = '' }) =>
  `${LIKECOIN_API_BASE}/like/info?iscn_id=${encodeURIComponent(
    iscnId
  )}&url=${encodeURIComponent(url)}`;

export const userPreferences = () => `/api/users/preferences`;

export const getLikerOgImage = id =>
  id === CIVIC_LIKER_CLASSIC_LIKER_ID
    ? 'https://liker.land/images/og/civic-classic.png'
    : `https://static.like.co/liker-og-image/${id}.png`;

export const getNFTMintInfo = ({ iscnId, classId }) => {
  const qsPayload = {
    iscn_id: iscnId,
    class_id: classId,
  };
  return `${LIKECOIN_API_BASE}/likernft/mint?${querystring.stringify(
    qsPayload
  )}`;
};

export const getNFTPurchaseInfo = ({ iscnId, classId }) => {
  const qsPayload = {
    iscn_id: iscnId,
    class_id: classId,
  };
  return `${LIKECOIN_API_BASE}/likernft/purchase?${querystring.stringify(
    qsPayload
  )}`;
};

export const getNFTHistory = ({ iscnId, classId, nftId, txHash }) => {
  const qsPayload = {
    iscn_id: iscnId,
    class_id: classId,
    nft_id: nftId,
    tx_hash: txHash,
  };
  return `${LIKECOIN_API_BASE}/likernft/history?${querystring.stringify(
    qsPayload
  )}`;
};

export const getNFTModel = ({ classId }) =>
  `${LIKECOIN_API_BASE}/likernft/metadata/model/class_${classId}.gltf`;

export const getUserNFTStats = wallet =>
  `${LIKECOIN_API_BASE}/likernft/user/${wallet}/stats`;

export const getLIKEPrice = () =>
  `https://api.coingecko.com/api/v3/simple/price?ids=likecoin&vs_currencies=usd`;

export const postNFTPurchase = ({ txHash, iscnId, classId, ts, wallet }) => {
  const qsPayload = {
    tx_hash: txHash,
    iscn_id: iscnId,
    class_id: classId,
    wallet,
    ts,
  };
  return `${LIKECOIN_API_BASE}/likernft/purchase?${querystring.stringify(
    qsPayload
  )}`;
};

export const postNFTTransfer = ({ txHash, classId, nftId }) => {
  const qsPayload = {
    class_id: classId,
    tx_hash: txHash,
    nft_id: nftId,
  };
  return `${LIKECOIN_API_BASE}/likernft/transfer?${querystring.stringify(
    qsPayload
  )}`;
};

export const postNewStripeFiatPayment = ({
  classId,
  wallet,
  utmCampaign,
  utmSource,
  utmMedium,
  referrer,
}) => {
  const qsPayload = {
    class_id: classId,
    wallet,
    utm_campaign: utmCampaign,
    utm_source: utmSource,
    utm_medium: utmMedium,
    referrer,
  };
  return `${LIKECOIN_API_BASE}/likernft/fiat/stripe/new?${querystring.stringify(
    qsPayload
  )}`;
};

export const getStripeFiatPaymentStatus = ({ paymentId }) => {
  const qsPayload = {
    payment_id: paymentId,
  };
  return `${LIKECOIN_API_BASE}/likernft/fiat/stripe/status?${querystring.stringify(
    qsPayload
  )}`;
};

export const getPaymentPrice = ({ classId }) => {
  const qsPayload = {
    class_id: classId,
  };
  return `${LIKECOIN_API_BASE}/likernft/payment/price?${querystring.stringify(
    qsPayload
  )}`;
};

export const getStripeFiatPendingClaimCount = email => {
  const url = new URL(
    `${LIKECOIN_API_BASE}/likernft/fiat/stripe/pending/count`
  );
  url.searchParams.append('email', email);
  return url.toString();
};

export const postStripeFiatPendingClaim = ({ wallet, paymentId, token }) => {
  const qsPayload = { wallet, payment_id: paymentId, token };
  return `${LIKECOIN_API_BASE}/likernft/fiat/stripe/pending/claim?${querystring.stringify(
    qsPayload
  )}`;
};

export const getNFTBookPaymentStatusEndpoint = ({
  classId,
  collectionId,
  paymentId,
  token,
}) => {
  const qsPayload = { token };
  return collectionId
    ? `${LIKECOIN_API_BASE}/likernft/book/collection/purchase/${collectionId}/status/${paymentId}?${querystring.stringify(
        qsPayload
      )}`
    : `${LIKECOIN_API_BASE}/likernft/book/purchase/${classId}/status/${paymentId}?${querystring.stringify(
        qsPayload
      )}`;
};

export const getNFTBookClaimEndpoint = ({
  classId,
  collectionId,
  paymentId,
  token,
}) => {
  const qsPayload = { token };
  return collectionId
    ? `${LIKECOIN_API_BASE}/likernft/book/collection/purchase/${collectionId}/claim/${paymentId}?${querystring.stringify(
        qsPayload
      )}`
    : `${LIKECOIN_API_BASE}/likernft/book/purchase/${classId}/claim/${paymentId}?${querystring.stringify(
        qsPayload
      )}`;
};

export const getNFTBookCartStatusEndpoint = ({ cartId, token }) => {
  const qsPayload = { token };
  return `${LIKECOIN_API_BASE}/likernft/book/purchase/cart/${cartId}/status?${querystring.stringify(
    qsPayload
  )}`;
};

export const getNFTBookCartClaimEndpoint = ({ cartId, token }) => {
  const qsPayload = { token };
  return `${LIKECOIN_API_BASE}/likernft/book/purchase/cart/${cartId}/claim?${querystring.stringify(
    qsPayload
  )}`;
};

export const getFreeNFTBookPurchaseEndpoint = ({
  classId,
  collectionId,
  priceIndex,
  gaClientId,
  gaSessionId,
  utmCampaign,
  utmSource,
  utmMedium,
  referrer,
  platform = NFT_BOOK_PLATFORM_LIKER_LAND,
}) => {
  const qsPayload = {
    price_index: priceIndex,
    from: platform,
    ga_client_id: gaClientId,
    ga_session_id: gaSessionId,
    utm_campaign: utmCampaign,
    utm_source: utmSource,
    utm_medium: utmMedium,
    referrer,
  };
  return collectionId
    ? `${LIKECOIN_API_BASE}/likernft/book/collection/purchase/${collectionId}/new/free?${querystring.stringify(
        qsPayload
      )}`
    : `${LIKECOIN_API_BASE}/likernft/book/purchase/${classId}/new/free?${querystring.stringify(
        qsPayload
      )}`;
};

export const getNFTCollectionInfo = ({ wallet, classId, type }) => {
  const qsPayload = {
    class_id: classId,
    wallet,
    type,
  };
  return `${LIKECOIN_API_BASE}/likernft/collection?${querystring.stringify(
    qsPayload
  )}`;
};

export const getNFTCollectionInfoById = ({ collectionId }) =>
  `${LIKECOIN_API_BASE}/likernft/collection/${collectionId}`;

export const getFreeNFTClassIds = () =>
  `${LIKECOIN_API_BASE}/likernft/list/free`;

export const getIdenticonAvatar = id =>
  `https://api.dicebear.com/7.x/identicon/svg?seed=${id}&backgroundColor=ffffff`;

export const getNFTClassMetadata = (classId, excludeOptions = []) => {
  const baseUrl = `${LIKECOIN_API_BASE}/likerland/nft/metadata?class_id=${classId}`;
  if (!excludeOptions.length) {
    return baseUrl;
  }
  const allOptions = [
    'class_chain',
    'class_api',
    'iscn',
    'owner',
    'purchase',
    'bookstore',
  ];
  const dataOptions = allOptions.filter(
    option => !excludeOptions.includes(option)
  );
  const queryParams = dataOptions.map(option => `data=${option}`).join('&');
  return `${baseUrl}${queryParams ? `&${queryParams}` : ''}`;
};

export const getUserV2Self = () => '/api/v2/users/self';
export const postUserV2Login = () => '/api/v2/users/login';
export const postUserV2Logout = () => '/api/v2/users/logout';

export const getShoppingCart = () => '/api/v2/users/cart';
export const postShoppingCart = getShoppingCart;
export const deleteShoppingCart = getShoppingCart;

export const getReaderEpubCfi = ({ classId, nftId, index }) =>
  `/api/v2/users/reader/epub/cfi?${querystring.stringify({
    class_id: classId,
    nft_id: nftId,
    index,
  })}`;
export const postReaderEpubCfi = getReaderEpubCfi;

export const postUserV2WalletEmail = ({
  email,
  followee,
  classId,
  paymentId,
  claimingToken,
  verify,
}) => {
  const qsPayload = {
    email,
    followee,
    class_id: classId,
    payment_id: paymentId,
    claiming_token: claimingToken,
    verify: verify ? '1' : '0',
  };
  return `/api/v2/users/email?${querystring.stringify(qsPayload)}`;
};
export const putUserV2WalletEmail = ({ wallet, token, followee }) => {
  const qsPayload = { wallet, token, followee };
  return `/api/v2/users/email?${querystring.stringify(qsPayload)}`;
};

export const updateEventLastSeen = () => `/api/v2/users/event/seen`;

export const getUserV2DisplayState = wallet =>
  `/api/v2/users/${wallet}/nfts/display-state`;

export const postUserV2DisplayState = wallet =>
  `/api/v2/users/${wallet}/nfts/display-state`;
export const getUserV2LocaleURL = () => `/api/v2/users/locale`;
export const getUserV2Followees = () => `/api/v2/users/followees`;
export const getUserV2Followers = () => `/api/v2/users/followers`;
export const postUserV2Followees = creator => {
  const qsPayload = { creator };
  return `/api/v2/users/followees?${querystring.stringify(qsPayload)}`;
};
export const deleteUserV2Followees = creator => {
  const qsPayload = { creator };
  return `/api/v2/users/followees?${querystring.stringify(qsPayload)}`;
};
export const getUserFollowees = wallet => `/api/v2/users/${wallet}/followees`;
export const postFollowCreator = ({ wallet, creator }) =>
  `/api/v2/users/${wallet}/followers?creator=${creator}`;
export const getUserNotificationSettingsUrl = () =>
  `/api/v2/users/notification`;

export const getNFTBookStorePricesByClassId = classId =>
  `${LIKECOIN_API_BASE}/likernft/book/store/${classId}`;

export const getNFTBookPurchaseLink = ({
  classId,
  priceIndex,
  coupon,
  collectionId,
  gaClientId,
  gaSessionId,
  platform = NFT_BOOK_PLATFORM_LIKER_LAND,
  utmCampaign,
  utmSource,
  utmMedium,
  referrer,
}) => {
  const qsPayload = {
    from: platform,
    coupon,
    ga_client_id: gaClientId,
    ga_session_id: gaSessionId,
    utm_campaign: utmCampaign,
    utm_source: utmSource,
    utm_medium: utmMedium,
    referrer,
  };
  if (priceIndex) qsPayload.price_index = priceIndex;
  return collectionId
    ? `${LIKECOIN_API_BASE}/likernft/book/collection/purchase/${collectionId}/new?${querystring.stringify(
        qsPayload
      )}`
    : `${LIKECOIN_API_BASE}/likernft/book/purchase/${classId}/new?${querystring.stringify(
        qsPayload
      )}`;
};

export const getNFTBookCartPurchaseLink = ({
  gaClientId,
  gaSessionId,
  utmCampaign,
  utmSource,
  utmMedium,
  referrer,
} = {}) => {
  const qsPayload = {
    ga_client_id: gaClientId,
    ga_session_id: gaSessionId,
    utm_campaign: utmCampaign,
    utm_source: utmSource,
    utm_medium: utmMedium,
    referrer,
  };
  return `${LIKECOIN_API_BASE}/likernft/book/purchase/cart/new?${querystring.stringify(
    qsPayload
  )}`;
};

export const getNftBookBuyerMessage = classId =>
  `${LIKECOIN_API_BASE}/likernft/book/purchase/${classId}/messages`;

export const fetchBookstoreLatestItems = () =>
  `${LIKECOIN_API_BASE}/likernft/book/store/list?limit=100&exclude_wallet=${BOOKSTORE_LIST_EXCLUDED_WALLET}`;

export const fetchBookstoreItemSearchResults = q => {
  const encodedQuery = encodeURIComponent(q);
  return `${LIKECOIN_API_BASE}/likernft/book/store/search?q=${encodedQuery}`;
};

export const fetchBookstoreCMSTags = ({ limit = 100 } = {}) =>
  `${EXTERNAL_HOST}/api/bookstore/tags?limit=${limit}`;

export const fetchBookstoreCMSProductsByTagId = (
  tagId,
  { offset, t = BOOKSTORE_CMS_CACHE_RESET_TIMESTAMP, limit = 30 } = {}
) => {
  const qsPayload = {
    tag: tagId,
    limit,
    t,
  };
  if (offset) qsPayload.offset = offset;
  return `${EXTERNAL_HOST}/api/bookstore/products?${querystring.stringify(
    qsPayload
  )}`;
};

export const fetchGutenbergCsv = () =>
  `${EXTERNAL_HOST}/csv/gutenberg-audio-books_v3.csv`;

export const postSubstackSubscribe = () =>
  `https://substackapi.com/api/subscribe`;

export const postLikeCoAuthenticate = () =>
  `${LIKECOIN_API_BASE}/wallet/authorize`;
