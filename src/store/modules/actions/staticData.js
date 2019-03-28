import * as types from '@/store/mutation-types';
import * as api from '@/util/api';

export async function fetchUserInfo({ commit }, id) {
  const user = await this.$axios.$get(api.getUserMinAPI(id));
  commit(types.STATIC_SET_USER_INFO, { id, user });
}
export async function fetchArticleInfo({ commit }, url) {
  const info = await this.$axios.$get(api.getArticleDetailAPI(url));
  commit(types.STATIC_SET_ARTICLE_INFO, { url, info });
}
