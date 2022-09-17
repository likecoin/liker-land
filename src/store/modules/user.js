/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */

import { USER_SET_USER_INFO, USER_UPDATE_USER_INFO } from '../mutation-types';
import * as actions from './actions/user';
import * as getters from './getters/user';

const state = () => ({
  user: {},
  subscriptionInfo: undefined,
});

const mutations = {
  [USER_SET_USER_INFO](state, user) {
    state.user = user;
  },
  [USER_UPDATE_USER_INFO](state, userUpdate) {
    state.user = { ...state.user, ...userUpdate };
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
