/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies

import {
  READER_ADD_FOLLOW_USER,
  READER_SET_FOLLOW_USER_LIST,
  READER_REMOVE_FOLLOW_USER,
  READER_ADD_UNFOLLOW_USER,
  READER_SET_UNFOLLOW_USER_LIST,
  READER_REMOVE_UNFOLLOW_USER,
  READER_UPDATE_USER_URL,
  READER_REMOVE_USER_URL,
} from '../mutation-types';
import * as getters from './getters/reader';
import * as actions from './actions/reader';

const state = () => ({
  followedUsers: [],
  unfollowedUsers: [],
  articles: {},
});

const mutations = {
  [READER_ADD_FOLLOW_USER](state, user) {
    state.followedUsers.push(user);
  },
  [READER_SET_FOLLOW_USER_LIST](state, users) {
    state.followedUsers = users;
  },
  [READER_REMOVE_FOLLOW_USER](state, user) {
    state.followedUsers = state.followedUsers.filter(u => u !== user);
  },
  [READER_ADD_UNFOLLOW_USER](state, user) {
    state.unfollowedUsers.push(user);
  },
  [READER_SET_UNFOLLOW_USER_LIST](state, users) {
    state.unfollowedUsers = users;
  },
  [READER_REMOVE_UNFOLLOW_USER](state, user) {
    state.unfollowedUsers = state.unfollowedUsers.filter(u => u !== user);
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
