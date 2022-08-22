/* eslint import/prefer-default-export: "off" */
import * as types from '@/store/mutation-types';
import { convertLikerCoinLocale } from '@/locales';

export function setLocale({ commit }, locale) {
  commit(types.UI_SET_LOCALE, convertLikerCoinLocale(locale));
}

export function setIsHK({ commit }, isHK) {
  commit(types.UI_SET_IS_HK, isHK);
}

export function toggleSlidingMenu({ commit }, isToggled) {
  commit(types.UI_TOGGLE_SLIDING_MENU, isToggled);
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

export function uiToggleCollectModal({ commit }) {
  commit(types.UI_TOGGLE_COLLECT_MODAL, true);
  commit(types.UI_SET_COLLECT_ERROR_MESSAGE, '');
}

export function uiSetCollectOwnedCount({ commit }, ownedCount) {
  commit(types.UI_SET_COLLECT_OWNED_COUNT, ownedCount);
}

export function uiSetCollectStatus({ commit }, status) {
  commit(types.UI_SET_COLLECT_STATUS, status);
}

export function uiSetCollectFailed({ commit }, error) {
  commit(types.UI_SET_COLLECT_ERROR_MESSAGE, error);
}

export function uiCloseCollectModal({ commit }) {
  commit(types.UI_TOGGLE_COLLECT_MODAL, false);
  commit(types.UI_SET_COLLECT_STATUS, '');
}
