/* eslint no-param-reassign: "off" */

import * as getters from './getters/ui';
import * as actions from './actions/ui';

import {
  UI_TOGGLE_SLIDING_MENU,
  UI_SET_LOCALE,
  UI_SET_IS_HK,
} from '../mutation-types';

import { defaultLocale, availableLocales } from '../../locales';

const initialState = () => ({
  locales: availableLocales,
  locale: defaultLocale,
  isHK: undefined,
  isSlidingMenuOpen: false,
});

const mutations = {
  [UI_SET_LOCALE](state, locale) {
    state.locale = locale;
  },
  [UI_SET_IS_HK](state, isHK) {
    state.isHK = isHK;
  },
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
