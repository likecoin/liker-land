/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import dateFormat from 'date-fns/format';

import {
  USER_SET_USER_INFO,
  USER_UPDATE_USER_INFO,
  USER_SET_SUBSCRIPTION_INFO,
} from '../mutation-types';
// eslint-disable-next-line import/no-cycle
import * as actions from './actions/user';
import * as getters from './getters/user';

const state = () => ({
  user: {},
  subscriptionInfo: undefined,
});

const mutations = {
  [USER_SET_USER_INFO](state, user) {
    state.user = user;
  },
  [USER_UPDATE_USER_INFO](state, userUpdate) {
    state.user = { ...state.user, ...userUpdate };
  },
  [USER_SET_SUBSCRIPTION_INFO](state, subscriptionInfo) {
    if (subscriptionInfo && subscriptionInfo.currentPeriodEnd) {
      subscriptionInfo.currentPeriodEndString = dateFormat(
        new Date(subscriptionInfo.currentPeriodEnd * 1000),
        'YYYY/MM/DD'
      );
    }
    state.subscriptionInfo = subscriptionInfo;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
