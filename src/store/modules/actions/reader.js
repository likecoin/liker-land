import * as types from '@/store/mutation-types';
import * as api from '@/util/api';

export async function fetchReaderIndex({ commit }) {
  const { list, unsubscribedUsers } = await this.$axios.$get(
    api.getFetchLikedUserApi()
  );
  commit(types.READER_SET_USER_LIST, list);
  commit(types.READER_SET_UNSUB_USER_LIST, unsubscribedUsers);
}

export async function subscribeAuthor({ commit, state, dispatch }, user) {
  await this.$axios.$post(api.getSubscribeUserAPI(user));
  commit(types.READER_ADD_USER, user);
  commit(types.READER_REMOVE_USER_UNSUB_USER, user);
  dispatch('fetchUserArticle', user);
}

export async function unsubscribeAuthor({ commit, state }, user) {
  await this.$axios.$delete(api.getSubscribeUserAPI(user));
  commit(types.READER_ADD_UNSUB_USER, user);
  commit(types.READER_REMOVE_USER, user);
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
