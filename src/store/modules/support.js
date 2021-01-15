/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies

import {
  SUPPORT_SET_SUPPORTING_USERS,
  SUPPORT_SET_SUPPORTING_USER_INFO,
  SUPPORT_REMOVE_SUPPORTING_USER,
  SUPPORT_SET_SUPPORTERS,
} from '../mutation-types';
import * as getters from './getters/support';
import * as actions from './actions/support';

const state = () => ({
  supportingUsers: {},
  supporters: [],
});

const mutations = {
  [SUPPORT_SET_SUPPORTING_USERS](state, supportingUsers) {
    state.supportingUsers = supportingUsers;
  },
  [SUPPORT_SET_SUPPORTING_USER_INFO](state, { user, ...info }) {
    Vue.set(state.supportingUsers, user, info);
  },
  [SUPPORT_REMOVE_SUPPORTING_USER](state, id) {
    Vue.delete(state.supportingUsers, id);
  },
  [SUPPORT_SET_SUPPORTERS](state, supporters) {
    state.supporters = supporters;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
