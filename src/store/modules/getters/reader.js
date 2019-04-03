export const getFollowedAuthors = state => state.followedUsers;
export const getUnfollowedAuthors = state => state.unfollowedUsers;

export const getAllArticles = state => {
  const res = state.followedUsers.reduce((a, u) => {
    if (state.articles.user[u]) {
      return a.concat(state.articles.user[u]);
    }
    return a;
  }, []);
  return res.sort((a, b) => b.ts - a.ts);
};

export const getUserArticles = state => user => state.articles.user[user] || [];
export const getFollowedArticles = state => state.articles.follow || [];
export const getSuggestedArticles = state => state.articles.suggest || [];

export const getIsInBookmark = state => url => state.bookmarks[url];
export const getUserBookmarks = state => Object.keys(state.bookmarks) || [];
