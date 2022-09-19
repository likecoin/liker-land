import { isWritingNFT } from '~/util/nft';

export const getUserInfoById = state => id => state.userInfosById[id];

export const getUserInfoByAddress = state => address =>
  state.userInfosByAddress[address];

export const getUserInfoLastQueryTimestamp = state => address =>
  state.userInfoLastQueryTimestamps[address];

export const getArticleInfoByReferrer = state => referrer =>
  state.articleInfos[referrer];
export const getArticleInfoByURL = state => url =>
  state.articleInfos.find(i => i.url === url);

export const getNFTClassPurchaseInfoById = state => id =>
  state.nftClassPurchaseInfo[id];

export const getNFTClassMetadataById = state => id =>
  state.nftClassMetadata[id];

export const getNFTClassOwnerInfoById = state => id =>
  state.nftClassOwnerInfo[id];

export const getNFTClassOwnerCount = state => id =>
  Object.keys(state.nftClassOwnerInfo[id] || {}).length;

export const getNFTClassMintedCount = state => id =>
  Object.values(state.nftClassOwnerInfo[id] || {}).reduce(
    (acc, val) => acc + val.length,
    0
  );

export const getNFTClassIdSorter = (_, getters) => classIds => {
  const sorted = [...classIds].sort((a, b) => {
    const aIsWritingNFT = isWritingNFT(getters.getNFTClassMetadataById(a));
    const bIsWritingNFT = isWritingNFT(getters.getNFTClassMetadataById(b));
    if (aIsWritingNFT && !bIsWritingNFT) return -1;
    if (!aIsWritingNFT && bIsWritingNFT) return 1;
    const priceA = getters.getNFTClassPurchaseInfoById(a)?.price;
    const priceB = getters.getNFTClassPurchaseInfoById(b)?.price;
    return priceB - priceA;
  });
  return sorted;
};
