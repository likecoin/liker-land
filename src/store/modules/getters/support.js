export const getCivicSupportingUsers = state => state.supportingUsers;
export const getCivicSupportingUserInfo = state => id =>
  state.supportingUsers[id];
export const getCivicIsSupportingUser = state => id =>
  state.supportingUsers[id] && state.supportingUsers[id].quantity > 0;

export const getMySupporters = state => state.supporters;
export const getMySupportersCount = state => state.supporters.length;
export const getMySupportersTotalQuantity = state =>
  state.supporters.reduce((a, s) => a + s.quantity, 0);
