export const getUserInfoById = state => id => state.userInfos[id];

export const getArticleInfoByReferrer = state => referrer =>
  state.articleInfos[referrer];
export const getArticleInfoByURL = state => url =>
  state.articleInfos.find(i => i.url === url);
