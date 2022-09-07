export const getLocale = state => state.locale;
export const getAvailableLocales = state => state.locales;

export const getIsSlidingMenuOpen = state => state.isSlidingMenuOpen;
export const getIsHK = state => state.isHK;

export const uiIsOpenSnackbar = state => state.isOpenSnackbar;
export const uiAlertType = state => state.alertType;
export const uiAlertMessage = state => state.alertMessage;

export const uiIsOpenCollectModal = state => state.isOpenCollectModal;
export const uiCollectOwnedCount = state => state.ownedCount;
export const uiCollectMethodCallback = state =>
  state.selectCollectMethodCallback;
export const uiTxTargetClassId = state => state.txTargetClassId;
export const uiTxNFTStatus = state => state.txStatus;
export const uiTxErrorMessage = state => state.txErrorMessage;
