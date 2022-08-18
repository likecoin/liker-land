/* eslint no-param-reassign: "off" */

import * as getters from './getters/ui';
import * as actions from './actions/ui';

import {
  UI_TOGGLE_SLIDING_MENU,
  UI_SET_LOCALE,
  UI_SET_IS_HK,
  UI_TOGGLE_SNACKBAR,
  UI_SET_ALERT_TYPE,
  UI_SET_ALERT_MESSAGE,
} from '../mutation-types';

import { defaultLocale, availableLocales } from '../../locales';

const initialState = () => ({
  locales: availableLocales,
  locale: defaultLocale,
  isHK: undefined,
  isSlidingMenuOpen: false,
  isOpenSnackbar: false,
  alertType: '',
  alertMessage: '',
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
  [UI_TOGGLE_SNACKBAR](state, isToggled) {
    state.isOpenSnackbar = isToggled;
  },
  [UI_SET_ALERT_TYPE](state, type) {
    state.alertType = type;
  },
  [UI_SET_ALERT_MESSAGE](state, message) {
    state.alertMessage = message;
  },
};

export default {
  actions,
  getters,
  state: initialState,
  mutations,
};
