export const getLocale = state => state.locale;
export const getAvailableLocales = state => state.locales;

export const getIsSlidingMenuOpen = state => state.isSlidingMenuOpen;
export const getIsHK = state => state.isHK;

export const uiIsOpenSnackbar = state => state.isOpenSnackbar;
export const uiAlertType = state => state.alertType;
export const uiAlertMessage = state => state.alertMessage;

export const uiIsOpenCollectModal = state => state.isOpenCollectModal;
export const uiCollectOwnedCount = state => state.ownedCount;
export const uiCollectNFTStatus = state => state.collectStatus;
export const uiCollectErrorMessage = state => state.collectErrorMessage;
