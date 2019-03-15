/* eslint no-param-reassign: "off" */

import * as getters from './getters/ui';
import * as actions from './actions/ui';

import { UI_TOGGLE_SLIDING_MENU } from '../mutation-types';

const initialState = () => ({
  isSlidingMenuOpen: false,
});

const mutations = {
  [UI_TOGGLE_SLIDING_MENU](state, isToggled) {
    state.isSlidingMenuOpen = isToggled;
  },
};

export default {
  actions,
  getters,
  state: initialState,
  mutations,
};
