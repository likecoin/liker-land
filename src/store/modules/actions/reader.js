import * as types from '@/store/mutation-types';
import * as api from '@/util/api';

export async function fetchReaderIndex({ commit }) {
  const { list, unfollowedUsers } = await this.$axios.$get(
    api.getFetchLikedUserApi()
  );
  commit(types.READER_SET_FOLLOW_USER_LIST, list);
  commit(types.READER_SET_UNFOLLOW_USER_LIST, unfollowedUsers);
  return { list, unfollowedUsers };
}

export async function followAuthor({ commit, state, dispatch }, user) {
  await this.$axios.$post(api.getFollowedUserAPI(user));
  commit(types.READER_ADD_FOLLOW_USER, user);
  commit(types.READER_REMOVE_UNFOLLOW_USER, user);
  dispatch('fetchUserArticle', user);
}

export async function unfollowAuthor({ commit, state }, user) {
  await this.$axios.$delete(api.getFollowedUserAPI(user));
  commit(types.READER_ADD_UNFOLLOW_USER, user);
  commit(types.READER_REMOVE_FOLLOW_USER, user);
  commit(types.READER_REMOVE_USER_ARTICLES, user);
}

export async function refreshBookmarkList({ commit }) {
  const { bookmarks } = await this.$axios.$get(api.getFetchReaderBookmarkAPI());
  commit(types.READER_SET_BOOKMARK, bookmarks);
  return bookmarks;
}

export async function addBookmark({ commit }, url) {
  commit(types.READER_ADD_BOOKMARK, url);
  await this.$axios.$post(api.getUpdateReaderBookmarkAPI(url));
}

export async function removeBookmark({ commit }, url) {
  commit(types.READER_REMOVE_BOOKMARK, url);
  await this.$axios.$delete(api.getUpdateReaderBookmarkAPI(url));
}

export async function fetchUserArticle({ commit, getters }, user) {
  const { list } = await this.$axios.$get(api.getFetchUserSuperLikeAPI(user), {
    withCredentials: false,
  });
  commit(types.READER_UPDATE_USER_ARTICLES, { user, list });
  return list;
}

export async function fetchSuggestedArticles({ commit, getters }) {
  const { list } = await this.$axios.$get(api.getFetchSuggestArticlesApi(), {
    withCredentials: false,
  });
  commit(types.READER_SET_SUGGEST_ARTICLES, list);
  return list;
}

export async function fetchFollowedArticles({ commit, getters }) {
  const { list } = await this.$axios.$get(api.getFetchFollowedSuperLikeApi());
  commit(types.READER_SET_FOLLOWED_ARTICLES, list);
  return list;
}

export async function updateFollowedArticles(
  { commit, getters },
  { after, before }
) {
  const { list } = await this.$axios.$get(api.getFetchFollowedSuperLikeApi(), {
    params: { after, before },
  });
  commit(types.READER_APPEND_FOLLOWED_ARTICLES, list);
  return list;
}
