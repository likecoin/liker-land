/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies

import {
  READER_ADD_USER,
  READER_SET_USER_LIST,
  READER_REMOVE_USER,
  READER_ADD_UNSUB_USER,
  READER_SET_UNSUB_USER_LIST,
  READER_REMOVE_USER_UNSUB_USER,
  READER_UPDATE_USER_URL,
  READER_REMOVE_USER_URL,
} from '../mutation-types';
import * as getters from './getters/reader';
import * as actions from './actions/reader';

const state = () => ({
  users: [],
  unsubscribedUsers: [],
  articles: {},
});

const mutations = {
  [READER_ADD_USER](state, user) {
    state.users.push(user);
  },
  [READER_SET_USER_LIST](state, users) {
    state.users = users;
  },
  [READER_REMOVE_USER](state, user) {
    state.users = state.users.filter(u => u !== user);
  },
  [READER_ADD_UNSUB_USER](state, user) {
    state.unsubscribedUsers.push(user);
  },
  [READER_SET_UNSUB_USER_LIST](state, users) {
    state.unsubscribedUsers = users;
  },
  [READER_REMOVE_USER_UNSUB_USER](state, user) {
    state.unsubscribedUsers = state.unsubscribedUsers.filter(u => u !== user);
  },
  [READER_UPDATE_USER_URL](state, { user, list }) {
    Vue.set(state.articles, user, list);
  },
  [READER_REMOVE_USER_URL](state, user) {
    Vue.delete(state.articles, user);
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
