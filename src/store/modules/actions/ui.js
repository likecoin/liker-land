/* eslint import/prefer-default-export: "off" */
import * as types from '@/store/mutation-types';

export function toggleSlidingMenu({ commit }, isToggled) {
  commit(types.UI_TOGGLE_SLIDING_MENU, isToggled);
}
