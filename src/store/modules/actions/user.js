import * as api from '@/util/api';

export function getOAuthToken({ commit }, authCode) {
  return this.$axios.$post(api.getOAuthCallbackAPI(), { authCode });
}

export async function fetchLoginStatus({ commit }) {
  try {
    await this.$axios.$get(api.getLoginStatus());
    return true;
  } catch (err) {
    return false;
  }
}
