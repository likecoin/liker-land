/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies

import {
  SUPPORT_SET_SUPPORTING_USERS,
  SUPPORT_SET_SUPPORTING_USER_INFO,
  SUPPORT_REMOVE_SUPPORTING_USER,
} from '../mutation-types';
import * as getters from './getters/support';
import * as actions from './actions/support';

const state = () => ({
  supportingUsers: {},
});

const mutations = {
  [SUPPORT_SET_SUPPORTING_USERS](state, supportingUsers) {
    state.supportingUsers = supportingUsers;
  },
  [SUPPORT_SET_SUPPORTING_USER_INFO](state, id, user) {
    Vue.set(state.supportingUsers, id, user);
  },
  [SUPPORT_REMOVE_SUPPORTING_USER](state, id) {
    Vue.delete(state.supportingUsers, id);
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
