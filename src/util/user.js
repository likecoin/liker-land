/* eslint-disable import/prefer-default-export */

export function checkUserNameValid(user) {
  return user && user.length <= 20 && /^[a-z0-9-_]+$/.test(user);
}

export function getAvatarHaloTypeFromUser(userObj = {}) {
  if (userObj.isCivicLikerTrial || userObj.isSubscribedCivicLiker) {
    return 'civic-liker';
  }
  return 'none';
}
