/* eslint import/prefer-default-export: "off" */
import * as types from '@/store/mutation-types';

export function setLocale({ commit }, locale) {
  commit(types.UI_SET_LOCALE, locale);
}

export function toggleSlidingMenu({ commit }, isToggled) {
  commit(types.UI_TOGGLE_SLIDING_MENU, isToggled);
}
