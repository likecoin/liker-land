/* eslint no-param-reassign: "off" */

import Vuex from 'vuex'; // eslint-disable-line import/no-extraneous-dependencies

import * as types from '@/store/mutation-types';
import * as api from '@/util/api';

import reader from './modules/reader';
import ui from './modules/ui';
import user from './modules/user';
import staticData from './modules/staticData';

const createStore = () =>
  new Vuex.Store({
    actions: {
      async nuxtServerInit({ commit }, ctx) {
        try {
          const userInfo = await this.$axios.$get(api.getLoginStatus());
          commit(types.USER_SET_USER_INFO, userInfo);
        } catch (err) {
          if (err.response) {
            if (err.response.status === 404) {
              // no op
              return;
            }
          }
          console.error(err); // eslint-disable-line no-console
        }
      },
    },
    modules: {
      reader,
      ui,
      user,
      staticData,
    },
  });

export default createStore;
