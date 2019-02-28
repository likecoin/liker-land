import * as api from '@/util/api';
import * as types from '@/store/mutation-types';

export async function getOAuthToken({ commit }, authCode) {
  const { token } = await this.$axios.$get(api.getOAuthCallbackAPI(authCode));
  commit(types.USER_SET_ACCESS_TOKEN, token);
  if (window.localStorage) {
    window.localStorage.setItem('accessToken', token);
  }
}

export function loadAuthInfo({ commit }) {
  if (window.localStorage) {
    const accessToken = window.localStorage.getItem('accessToken');
    if (accessToken) commit(types.USER_SET_ACCESS_TOKEN, accessToken);
  }
}
