export const getUserInfoById = state => id => state.userInfos[id];

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
