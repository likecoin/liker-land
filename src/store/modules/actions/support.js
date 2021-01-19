import * as types from '@/store/mutation-types';
import * as api from '@/util/api';

export async function fetchCivicSupportingUsers({ commit }) {
  const { list } = await this.$api.$get(api.getCivicSupportingUserListAPI());
  const map = list.reduce((acc, cur) => {
    const { id, ...data } = cur;
    acc[id] = data;
    return acc;
  }, {});
  commit(types.SUPPORT_SET_SUPPORTING_USERS, map);
  return map;
}

export async function updateCivicSupportQuantity(
  { commit },
  { user, quantity }
) {
  await this.$api.$post(api.getCivicSupportingUserAPI(user), { quantity });
  commit(types.SUPPORT_SET_SUPPORTING_USER_INFO, { user, quantity });
}

export async function removeCivicSupportUser({ commit }, user) {
  await this.$api.$delete(api.getCivicSupportingUserAPI(user));
  commit(types.SUPPORT_REMOVE_SUPPORTING_USER, user);
}

export async function fetchMySupporters({ commit }) {
  const { list = [] } = await this.$api.$get(api.getMySupportersAPI());
  commit(types.SUPPORT_SET_SUPPORTERS, list);
  return list;
}
