/* eslint no-param-reassign: "off" */

import Vuex from 'vuex'; // eslint-disable-line import/no-extraneous-dependencies

import * as types from '@/store/mutation-types';

import { AUTH_COOKIE_NAME } from '~/constant';
import ui from './modules/ui';
import user from './modules/user';
import staticData from './modules/staticData';
import wallet from './modules/wallet';
import nft from './modules/nft';

const createStore = () =>
  new Vuex.Store({
    actions: {
      async nuxtServerInit({ dispatch }, { req, res, query }) {
        if (res.timing) {
          res.timing.start('store_init', 'nuxtServerInit Started');
        }
        try {
          if (req.cookies && req.cookies[AUTH_COOKIE_NAME]) {
            await dispatch('walletFetchSessionUserInfo');
          }
        } catch (err) {
          if (err.response) {
            if (err.response.status !== 404 && err.response.status !== 401) {
              console.error(err); // eslint-disable-line no-console
            }
          }
        }
        if (query.debug !== undefined) {
          commit(types.WALLET_SET_IS_DEBUG, true);
        }
        if (res.timing) res.timing.end('store_init');
      },
    },
    modules: {
      ui,
      user,
      staticData,
      wallet,
      nft,
    },
  });

export default createStore;
