import * as types from '@/store/mutation-types';
import * as api from '@/util/api';

export async function fetchReaderIndex({ commit }) {
  const { list, unfollowedUsers } = await this.$axios.$get(
    api.getFetchLikedUserApi()
  );
  commit(types.READER_SET_FOLLOW_USER_LIST, list);
  commit(types.READER_SET_UNFOLLOW_USER_LIST, unfollowedUsers);
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
  commit(types.READER_REMOVE_USER_URL, user);
}

export async function fetchUserArticle({ commit }, user) {
  const { list } = await this.$axios.$get(api.getFetchUserArticlesAPI(user));
  commit(types.READER_UPDATE_USER_URL, { user, list });
}

export async function fetchSuggestedArticles({ commit }) {
  const { list } = await this.$axios.$get(api.getFetchSuggestArticlesApi());
  return list;
}
