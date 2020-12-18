export const getCivicSupportingUsers = state => state.supportingUsers;
export const getCivicSupportingUserInfo = state => id =>
  state.supportingUsers[id];
export const getCivicIsSupportingUser = state => id =>
  state.supportingUsers[id] && state.supportingUsers[id].quantity > 0;
