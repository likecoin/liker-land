/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import { USER_SET_ACCESS_TOKEN } from '../mutation-types';
import * as actions from './actions/user';
import * as getters from './getters/user';

const state = () => ({
  token: '',
});

const mutations = {
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
