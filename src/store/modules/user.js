/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  USER_SET_USER_INFO,
  USER_UPDATE_USER_INFO,
  USER_SET_ACCESS_TOKEN,
} from '../mutation-types';
import * as actions from './actions/user';
import * as getters from './getters/user';

const state = () => ({
  token: '',
  user: {},
});

const mutations = {
  [USER_SET_USER_INFO](state, user) {
    state.user = user;
  },
  [USER_UPDATE_USER_INFO](state, userUpdate) {
    state.user = { ...state.user, ...userUpdate };
  },
  [USER_SET_ACCESS_TOKEN](state, token) {
    state.token = token;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
