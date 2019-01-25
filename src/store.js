/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    users: ['a'],
    articles: { a: ['test'] },
  },
  mutations: {
    UPDATE_USER_LIST(state, users) {
      state.users = users;
    },
    UPDATE_USER_URL(state, { user, list }) {
      Vue.set(state.articles, user, list);
    },
  },
  actions: {
    async fetchUser({ commit }) {
      const { data } = await axios.get('https://api.rinkeby.like.co/like/info/liked/list', { withCredentials: true });
      commit('UPDATE_USER_LIST', data.list);
    },
    async fetchArticle({ commit }, user) {
      const { data } = await axios.get(`https://api.rinkeby.like.co/like/info/user/${user}/latest`, { withCredentials: true });
      commit('UPDATE_USER_URL', { user, list: data.list });
    },
  },
  getters: {
    getAllArticles: (state) => {
      const res = state.users.reduce((a, u) => {
        if (state.articles[u]) {
          return a.concat(state.articles[u]);
        }
        return a;
      }, []);
      res.sort((a, b) => a.ts > b.ts);
      return res;
    },
  },
});
