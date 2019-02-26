/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import {
  API_BASE,
  OAUTH_CALLBACK_URL,
} from '@/constant';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: '',
    users: [],
    articles: {},
  },
  mutations: {
    UPDATE_USER_LIST(state, users) {
      state.users = users;
    },
    UPDATE_USER_URL(state, { user, list }) {
      Vue.set(state.articles, user, list);
    },
    SET_ACCESS_TOKEN(state, token) {
      state.token = token;
    },
  },
  actions: {
    loadAuthInfo({ commit }) {
      if (window.localStorage) {
        const accessToken = window.localStorage.getItem('accessToken');
        if (accessToken) commit('SET_ACCESS_TOKEN', accessToken);
      }
    },
    async fetchUser({ commit, state }) {
      const { data } = await axios.get(`${API_BASE}/like/info/liked/list?access_token=${state.token}`, { withCredentials: true });
      commit('UPDATE_USER_LIST', data.list);
    },
    async fetchArticle({ commit, state }, user) {
      const { data } = await axios.get(`${API_BASE}/like/info/user/${user}/latest?access_token=${state.token}`, { withCredentials: true });
      commit('UPDATE_USER_URL', { user, list: data.list });
    },
    async getOAuthToken({ commit }, authCode) {
      const { data } = await axios.get(`${OAUTH_CALLBACK_URL}${authCode}`);
      commit('SET_ACCESS_TOKEN', data.token);
      if (window.localStorage) {
        window.localStorage.setItem('accessToken', data.token);
      }
    },
  },
  getters: {
    getOAuthToken: state => state.token,
    getAllArticles: (state) => {
      const res = state.users.reduce((a, u) => {
        if (state.articles[u]) {
          return a.concat(state.articles[u]);
        }
        return a;
      }, []);
      return res.sort((a, b) => b.ts - a.ts);
    },
  },
});
