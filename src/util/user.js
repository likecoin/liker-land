/* eslint-disable import/prefer-default-export */

export function getAvatarHaloTypeFromUser(userObj = {}) {
  if (userObj.isCivicLikerTrial || userObj.isSubscribedCivicLiker) {
    return 'civic-liker';
  }
  return 'none';
}
