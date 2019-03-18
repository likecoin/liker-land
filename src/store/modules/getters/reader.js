export const getSubscribedAuthors = state => state.users;
export const getUnsubscribedAuthors = state => state.unsubscribedUsers;

export const getAllArticles = state => {
  const res = state.users.reduce((a, u) => {
    if (state.articles[u]) {
      return a.concat(state.articles[u]);
    }
    return a;
  }, []);
  return res.sort((a, b) => b.ts - a.ts);
};

export const getUserArticles = state => user => state.articles[user] || [];
