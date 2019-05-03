/* eslint import/prefer-default-export: "off" */
import * as types from '@/store/mutation-types';
import { covertLikeCoinLocale } from '@/locales';

export function setLocale({ commit }, locale) {
  commit(types.UI_SET_LOCALE, covertLikeCoinLocale(locale));
}

export function toggleSlidingMenu({ commit }, isToggled) {
  commit(types.UI_TOGGLE_SLIDING_MENU, isToggled);
}
