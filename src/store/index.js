/* eslint no-param-reassign: "off" */
import Vuex from 'vuex'; // eslint-disable-line import/no-extraneous-dependencies
import * as types from '@/store/mutation-types';
import * as api from '@/util/api';
import reader from './modules/reader';
import user from './modules/user';

const createStore = () =>
  new Vuex.Store({
    actions: {
      async nuxtServerInit({ commit }, ctx) {
        try {
          const { user: id } = await this.$axios.$get(api.getLoginStatus());
          commit(types.USER_SET_USER_INFO, { id });
        } catch (err) {
          // no op
        }
      },
    },
    modules: {
      reader,
      user,
    },
  });

export default createStore;
