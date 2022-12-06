/* eslint no-param-reassign: "off" */

import * as getters from './getters/ui';
import * as actions from './actions/ui';

import {
  UI_SET_LOCALE,
  UI_SET_IS_HK,
  UI_TOGGLE_SNACKBAR,
  UI_SET_ALERT_TYPE,
  UI_SET_ALERT_MESSAGE,
  UI_TOGGLE_COLLECT_MODAL,
  UI_SET_TX_STATUS,
  UI_SET_TX_ERROR_MESSAGE,
  UI_SET_TARGET_CLASSID,
} from '../mutation-types';

import { defaultLocale, availableLocales } from '../../locales';

const initialState = () => ({
  // locales
  locales: availableLocales,
  locale: defaultLocale,
  isHK: undefined,

  // alert snackbar
  isOpenSnackbar: false,
  alertType: '',
  alertMessage: '',

  // NFT collect dialog
  isOpenCollectModal: false,
  txStatus: '',
  txErrorMessage: '',
  ownedCount: null,
  txTargetClassId: null,
  selectCollectMethodCallback: null,
});

const mutations = {
  [UI_SET_LOCALE](state, locale) {
    state.locale = locale;
  },
  [UI_SET_IS_HK](state, isHK) {
    state.isHK = isHK;
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
  [UI_SET_TARGET_CLASSID](state, classId) {
    state.txTargetClassId = classId;
  },
  [UI_SET_TX_STATUS](state, status) {
    state.txStatus = status;
  },
  [UI_SET_TX_ERROR_MESSAGE](state, error) {
    state.txErrorMessage = error;
  },
};

export default {
  actions,
  getters,
  state: initialState,
  mutations,
};
