/* eslint import/prefer-default-export: "off" */
const ErrorType = { INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE' };

export const getLocale = state => state.locale;
export const getAvailableLocales = state => state.locales;

export const getIsSlidingMenuOpen = state => state.isSlidingMenuOpen;
export const getIsHK = state => state.isHK;

export const getIsOpenSnackbar = state => state.isOpenSnackbar;
export const getAlertType = state => state.alertType;
export const getAlertMessage = state => state.alertMessage;
