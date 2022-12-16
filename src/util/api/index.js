import querystring from 'querystring';
import {
  CIVIC_LIKER_CLASSIC_LIKER_ID,
  EXTERNAL_HOST,
  LIKECOIN_API_BASE,
  LIKECOIN_CHAIN_VIEW_TX,
  LIKECOIN_CHAIN_API,
  LIKE_CO_THUMBNAIL_FN_BASE,
  LIKECOIN_NFT_API_WALLET,
} from '../../constant';
import { normalizeLocaleForLikeCo } from '../../locales';

export const getAppURL = ({
  referrer,
  utmCampaign,
  utmSource = 'likerland',
  utmMedium,
} = {}) => {
  if (referrer) {
    const queryObject = {
      event: 'app_referral',
      referrer,
      '~campaign': utmCampaign,
      '~channel': utmSource,
      '~feature': utmMedium,
    };
    return `https://likerland.app.link/?${querystring.stringify(queryObject)}`;
  }
  const queryObject = {
    utm_campaign: utmCampaign,
    utm_source: utmSource,
    utm_medium: utmMedium,
  };
  return `https://likecoin.page.link/likerland?${querystring.stringify(
    queryObject
  )}`;
};

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

export const getNFTHistory = ({ iscnId, classId, nftId }) => {
  const qsPayload = {
    iscn_id: iscnId,
    class_id: classId,
    nft_id: nftId,
  };
  return `${LIKECOIN_API_BASE}/likernft/history?${querystring.stringify(
    qsPayload
  )}`;
};

export const getNFTMetadata = ({ iscnId, classId, nftId }) => {
  const qsPayload = {
    iscn_id: iscnId,
    class_id: classId,
    nft_id: nftId,
  };
  return `${LIKECOIN_API_BASE}/likernft/metadata?${querystring.stringify(
    qsPayload
  )}`;
};

export const getUserNFTStats = wallet =>
  `${LIKECOIN_API_BASE}/likernft/user/${wallet}/stats`;

export const getLIKEPrice = () =>
  `https://api.coingecko.com/api/v3/simple/price?ids=likecoin&vs_currencies=usd`;

export const getChainExplorerTx = hash => `${LIKECOIN_CHAIN_VIEW_TX}/${hash}`;

export const getChainRawTx = hash =>
  `${LIKECOIN_CHAIN_API}/cosmos/tx/v1beta1/txs/${hash}`;

export const getChainNFTClassMetadataEndpoint = classId =>
  `${LIKECOIN_CHAIN_API}/cosmos/nft/v1beta1/classes/${classId}`;

export const getChainNFTMetadataEndpoint = (classId, nftId) =>
  `${LIKECOIN_CHAIN_API}/cosmos/nft/v1beta1/nfts/${classId}/${nftId}`;

export const getISCNRecord = iscnId => {
  const qsPayload = {
    iscn_id: iscnId,
  };
  return `${LIKECOIN_CHAIN_API}/iscn/records/id?${querystring.stringify(
    qsPayload
  )}`;
};

export const getNFTClassesPartial = ({ owner, limit, key }) => {
  const qsPayload = { iscn_owner: owner }; // TODO: support account based query
  if (limit) qsPayload['pagination.limit'] = limit;
  if (key) qsPayload['pagination.key'] = key;
  return `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/class?${querystring.stringify(
    qsPayload
  )}`;
};

export const getNFTsPartial = ({ owner, expandClasses, limit, key }) => {
  const qsPayload = { owner };
  if (expandClasses) qsPayload.expand_classes = 1;
  if (limit) qsPayload['pagination.limit'] = limit;
  if (key) qsPayload['pagination.key'] = key;
  return `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/nft?${querystring.stringify(
    qsPayload
  )}`;
};

export const getNFTOwners = classId => {
  const qsPayload = {
    class_id: classId,
  };
  return `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/owner?${querystring.stringify(
    qsPayload
  )}`;
};

export const getNFTEvents = ({
  classId,
  nftId,
  limit,
  key,
  actionType,
  ignoreToList,
}) => {
  const qsPayload = {
    class_id: classId,
    nft_id: nftId,
    action_type: actionType,
  };
  if (ignoreToList) qsPayload.ignore_to_list = ignoreToList;
  if (key) qsPayload.key = key;
  if (limit) qsPayload.limit = limit;
  return `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/event?${querystring.stringify(
    qsPayload
  )}`;
};

export const postNFTPurchase = ({ txHash, iscnId, classId, ts }) => {
  const qsPayload = {
    tx_hash: txHash,
    iscn_id: iscnId,
    class_id: classId,
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

export const postNewStripeFiatPayment = ({ classId, wallet }) => {
  const qsPayload = {
    class_id: classId,
    wallet,
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

export const getStripeFiatPrice = ({ classId }) => {
  const qsPayload = {
    class_id: classId,
  };
  return `${LIKECOIN_API_BASE}/likernft/fiat/stripe/price?${querystring.stringify(
    qsPayload
  )}`;
};

export const getLatestNFTClasses = `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/class?reverse=true`;
export const getTopNFTClasses = `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/ranking?ignore_list=${LIKECOIN_NFT_API_WALLET}`;

export const getIdenticonAvatar = id =>
  `https://avatars.dicebear.com/api/identicon/${id}.svg?background=%23ffffff`;

export const nftMintSubscriptionAPI = ({ id, email, wallet }) => {
  const qsPayload = { email, wallet };
  return `${EXTERNAL_HOST}/api/nft/mint-subscription${
    id ? `/${id}` : ''
  }?${querystring.stringify(qsPayload)}`;
};

export const getUserV2Self = () => '/api/v2/users/self';
export const postUserV2Login = () => '/api/v2/users/login';

export const getNFTDisplayStateURL = wallet =>
  `/api/v2/users/${wallet}/nfts/display-state`;
