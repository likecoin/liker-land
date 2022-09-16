export const getUserInfo = state => state.user;
export const getUserId = state => state.user.user;
export const getUserIsCivicLiker = state => !!state.user.isSubscribedCivicLiker;
export const getUserCivicLikerHalo = ({ user }) => {
  if (user.isSubscribedCivicLiker) {
    return 'civic-liker';
  }
  return 'none';
};
export const getHomeRoute = () => ({
  name: 'index',
});
export const userAccountBalance = state =>
  Number(state.accountBalance).toFixed(2);
