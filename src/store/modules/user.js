/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */

import {
  USER_SET_USER_INFO,
  USER_UPDATE_USER_INFO,
  USER_SET_GA_CLIENT_ID,
  USER_SET_GA_SESSION_ID,
} from '../mutation-types';
import * as actions from './actions/user';
import * as getters from './getters/user';

const state = () => ({
  user: {},
  gaClientId: undefined,
  gaSessionId: undefined,
});

const mutations = {
  [USER_SET_USER_INFO](state, user) {
    state.user = user;
  },
  [USER_UPDATE_USER_INFO](state, userUpdate) {
    state.user = { ...state.user, ...userUpdate };
  },
  [USER_SET_GA_CLIENT_ID](state, gaClientId) {
    state.gaClientId = gaClientId;
  },
  [USER_SET_GA_SESSION_ID](state, gaSessionId) {
    state.gaSessionId = gaSessionId;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
