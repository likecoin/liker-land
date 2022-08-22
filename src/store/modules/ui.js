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
  UI_TOGGLE_COLLECT_MODAL,
  UI_SET_COLLECT_STATUS,
  UI_SET_COLLECT_ERROR_MESSAGE,
  UI_SET_COLLECT_OWNED_COUNT,
} from '../mutation-types';

import { defaultLocale, availableLocales } from '../../locales';

const initialState = () => ({
  // locales
  locales: availableLocales,
  locale: defaultLocale,
  isHK: undefined,

  // sliding menu
  isSlidingMenuOpen: false,

  // alert snackbar
  isOpenSnackbar: false,
  alertType: '',
  alertMessage: '',

  // NFT collect dialog
  isOpenCollectModal: false,
  collectStatus: '',
  collectErrorMessage: '',
  ownedCount: null,
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
  [UI_TOGGLE_COLLECT_MODAL](state, isToggled) {
    state.isOpenCollectModal = isToggled;
  },
  [UI_SET_COLLECT_OWNED_COUNT](state, ownedCount) {
    state.ownedCount = ownedCount;
  },
  [UI_SET_COLLECT_STATUS](state, status) {
    state.collectStatus = status;
  },
  [UI_SET_COLLECT_ERROR_MESSAGE](state, error) {
    state.collectErrorMessage = error;
  },
};

export default {
  actions,
  getters,
  state: initialState,
  mutations,
};
