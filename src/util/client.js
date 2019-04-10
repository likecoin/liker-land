/* eslint-disable import/prefer-default-export */

const MOBILE_CLIENT_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;

export function checkIsMobileClient() {
  if (!global.window) return false;
  return MOBILE_CLIENT_REGEX.test(global.window.navigator.userAgent);
}
