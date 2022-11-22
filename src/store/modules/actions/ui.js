/* eslint import/prefer-default-export: "off" */
import * as types from '@/store/mutation-types';
import { convertLikerCoinLocale } from '@/locales';

export function setLocale({ commit }, locale) {
  commit(types.UI_SET_LOCALE, convertLikerCoinLocale(locale));
}

export function setIsHK({ commit }, isHK) {
  commit(types.UI_SET_IS_HK, isHK);
}

export function uiPromptErrorAlert({ commit }, message) {
  commit(types.UI_TOGGLE_SNACKBAR, true);
  commit(types.UI_SET_ALERT_TYPE, 'warn');
  commit(types.UI_SET_ALERT_MESSAGE, message);
}

export function uiPromptSuccessAlert({ commit }, message) {
  commit(types.UI_TOGGLE_SNACKBAR, true);
  commit(types.UI_SET_ALERT_TYPE, 'success');
  commit(types.UI_SET_ALERT_MESSAGE, message);
}

export function uiCloseAlert({ commit }) {
  commit(types.UI_TOGGLE_SNACKBAR, false);
  commit(types.UI_SET_ALERT_TYPE, '');
  commit(types.UI_SET_ALERT_MESSAGE, '');
}

export function uiToggleCollectModal({ commit }, { classId, status }) {
  commit(types.UI_TOGGLE_COLLECT_MODAL, true);
  commit(types.UI_SET_TX_ERROR_MESSAGE, '');
  commit(types.UI_SET_TARGET_CLASSID, classId);
  commit(types.UI_SET_TX_STATUS, status || '');
}

export function uiSetTxStatus({ commit }, status) {
  commit(types.UI_SET_TX_STATUS, status);
}

export function uiSetTxError({ commit }, error) {
  commit(types.UI_SET_TX_ERROR_MESSAGE, error);
}

export function uiCloseTxModal({ commit }) {
  commit(types.UI_TOGGLE_COLLECT_MODAL, false);
  commit(types.UI_SET_TX_STATUS, '');
}
