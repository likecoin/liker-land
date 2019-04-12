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
  READER_UPDATE_USER_ARTICLES,
  READER_REMOVE_USER_ARTICLES,
  READER_SET_FOLLOWED_ARTICLES,
  READER_APPEND_FOLLOWED_ARTICLES,
  READER_SET_SUGGEST_ARTICLES,
  READER_SET_BOOKMARK,
  READER_ADD_BOOKMARK,
  READER_REMOVE_BOOKMARK,
} from '../mutation-types';
import * as getters from './getters/reader';
import * as actions from './actions/reader';

function sortArticles(list) {
  return list.sort((a, b) => b.ts - a.ts);
}

const state = () => ({
  followedUsers: [],
  unfollowedUsers: [],
  articles: { user: {} },
  bookmarks: {},
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
  [READER_SET_FOLLOWED_ARTICLES](state, list) {
    Vue.set(state.articles, 'follow', sortArticles(list));
  },
  [READER_APPEND_FOLLOWED_ARTICLES](state, list) {
    list = state.articles.follow.concat(list);
    Vue.set(state.articles, 'follow', sortArticles(list));
  },
  [READER_SET_SUGGEST_ARTICLES](state, list) {
    Vue.set(state.articles, 'suggest', list);
  },
  [READER_UPDATE_USER_ARTICLES](state, { user, list }) {
    Vue.set(state.articles.user, user, list);
  },
  [READER_REMOVE_USER_ARTICLES](state, user) {
    Vue.delete(state.articles.user, user);
  },
  [READER_SET_BOOKMARK](state, bookmarks) {
    state.bookmarks = bookmarks.reduce((acc, b) => {
      acc[b] = true;
      return acc;
    }, {});
  },
  [READER_ADD_BOOKMARK](state, bookmark) {
    Vue.set(state.bookmarks, bookmark, true);
  },
  [READER_REMOVE_BOOKMARK](state, bookmark) {
    Vue.delete(state.bookmarks, bookmark);
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
