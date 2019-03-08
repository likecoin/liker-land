import * as api from '@/util/api';

export function getOAuthToken({ commit }, { authCode, state }) {
  return this.$axios.$post(api.getOAuthCallbackAPI(), { authCode, state });
}

export async function fetchLoginStatus({ commit }) {
  try {
    await this.$axios.$get(api.getLoginStatus());
    return true;
  } catch (err) {
    return false;
  }
}
