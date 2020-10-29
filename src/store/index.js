/* eslint no-param-reassign: "off" */

import Vuex from 'vuex'; // eslint-disable-line import/no-extraneous-dependencies

import * as types from '@/store/mutation-types';
import * as api from '@/util/api';

import reader from './modules/reader';
import ui from './modules/ui';
import user from './modules/user';
import staticData from './modules/staticData';
import { AUTH_COOKIE_NAME } from '~/constant';

const createStore = () =>
  new Vuex.Store({
    actions: {
      async nuxtServerInit({ commit }, { req, res }) {
        if (res.timing) {
          res.timing.start('store_init', 'nuxtServerInit Started');
        }
        try {
          if (req.cookies && req.cookies[AUTH_COOKIE_NAME]) {
            const userInfo = await this.$axios.$get(api.getLoginStatus());
            commit(types.USER_SET_USER_INFO, userInfo);
          }
        } catch (err) {
          if (err.response) {
            if (err.response.status !== 404 && err.response.status !== 401) {
              console.error(err); // eslint-disable-line no-console
            }
          }
        }
        if (res.timing) res.timing.end('store_init');
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
