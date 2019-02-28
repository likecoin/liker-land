/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies

import {
  READER_UPDATE_USER_LIST,
  READER_UPDATE_USER_URL,
} from '../mutation-types';
import * as getters from './getters/reader';
import * as actions from './actions/reader';

const state = () => ({
  users: [],
  articles: {},
});

const mutations = {
  [READER_UPDATE_USER_LIST](state, users) {
    state.users = users;
  },
  [READER_UPDATE_USER_URL](state, { user, list }) {
    Vue.set(state.articles, user, list);
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
