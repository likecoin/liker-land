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
          const userInfo = await this.$axios.$get(api.getLoginStatus());
          commit(types.USER_SET_USER_INFO, userInfo);
        } catch (err) {
          console.error(err); // eslint-disable-line no-console
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
