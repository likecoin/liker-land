export const getFollowedAuthors = state => state.followedUsers;
export const getUnfollowedAuthors = state => state.unfollowedUsers;

export const getAllArticles = state => {
  const res = state.followedUsers.reduce((a, u) => {
    if (state.articles[u]) {
      return a.concat(state.articles[u]);
    }
    return a;
  }, []);
  return res.sort((a, b) => b.ts - a.ts);
};

export const getUserArticles = state => user => state.articles[user] || [];
