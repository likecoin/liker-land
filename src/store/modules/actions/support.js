import * as types from '@/store/mutation-types';
import * as api from '@/util/api';

export async function fetchCivicSupportingUsers({ commit }) {
  const { list } = await this.$api.$get(api.getCivicSupportingUserListAPI());
  commit(types.SUPPORT_SET_SUPPORTING_USERS, list);
  return { list };
}

export async function updateCivicSupportQuantity(
  { commit },
  { user, quantity }
) {
  await this.$api.$post(api.getCivicSupportingUserAPI(user), { quantity });
  commit(types.SUPPORT_SET_SUPPORTING_USER_INFO, user);
}

export async function removeCivicSupportUser({ commit }, user) {
  await this.$api.$delete(api.getCivicSupportingUserAPI(user));
  commit(types.SUPPORT_REMOVE_SUPPORTING_USER, user);
}
