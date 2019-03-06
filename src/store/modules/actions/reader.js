/* eslint import/prefer-default-export: "off" */
import * as types from '@/store/mutation-types';
import * as api from '@/util/api';

export async function fetchUser({ commit, rootState }) {
  const { list } = await this.$axios.$get(api.getFetchLikedUserApi());
  commit(types.READER_UPDATE_USER_LIST, list);
}

export async function fetchArticle({ commit, rootState }, user) {
  const { list } = await this.$axios.$get(api.getFetchUserArticlesAPI(user));
  commit(types.READER_UPDATE_USER_URL, { user, list });
}
