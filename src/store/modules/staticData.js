/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies

import {
  STATIC_SET_USER_INFO,
  STATIC_SET_ARTICLE_INFO,
} from '../mutation-types';
import * as getters from './getters/staticData';
import * as actions from './actions/staticData';

const state = () => ({
  userInfos: {},
  articleInfos: {},
});

const mutations = {
  [STATIC_SET_USER_INFO](state, { id, user }) {
    Vue.set(state.userInfos, id, user);
  },
  [STATIC_SET_ARTICLE_INFO](state, { referrer, info }) {
    Vue.set(state.articleInfos, referrer, info);
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
