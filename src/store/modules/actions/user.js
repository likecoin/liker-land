import * as types from '@/store/mutation-types';
import * as api from '@/util/api';

export async function getOAuthToken({ commit }, { authCode, state }) {
  const { user } = await this.$axios.$post(api.getOAuthCallbackAPI(), {
    authCode,
    state,
  });
  commit(types.USER_SET_USER_INFO, { id: user });
}

export async function fetchLoginStatus({ commit }) {
  try {
    const { user } = await this.$axios.$get(api.getLoginStatus());
    commit(types.USER_SET_USER_INFO, { id: user });
    return true;
  } catch (err) {
    return false;
  }
}
