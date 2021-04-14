export const getUserInfo = state => state.user;
export const getUserSubscriptionInfo = state => state.subscriptionInfo;
export const getUserIsSubscriptionPastDue = state =>
  state.subscriptionInfo && state.subscriptionInfo.status === 'past_due';
export const getUserId = state => state.user.user;
export const getUserIsCivicLikerTrial = state => !!state.user.isCivicLikerTrial;
export const getUserIsCivicLiker = state => !!state.user.isSubscribedCivicLiker;
export const getUserIsCivicLikerV2 = state =>
  state.user.civicLikerVersion === 2;
export const getUserIsCivicLikerPaid = ({ user }) =>
  user.isSubscribedCivicLiker && !user.isCivicLikerTrial;
export const getUserIsExpiredCivicLiker = ({ user }) =>
  user.isExpiredCivicLiker;
export const getUserShouldRenewCivic = ({ user }) =>
  user.isCivicLikerRenewalPeriod || user.isExpiredCivicLiker;
export const getUserCivicLikerHalo = ({ user }) => {
  if (user.isCivicLikerTrial || user.isSubscribedCivicLiker) {
    return 'civic-liker';
  }
  return 'none';
};
export const getUserIsSuperLiker = state => state.user.isSuperLiker;
export const getHomeRoute = state => ({
  name: state.user.user ? 'index-following' : 'index',
});
