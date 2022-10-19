import { MAX_USER_ID_LENGTH } from '~/constant';

export function checkUserNameValid(user) {
  return (
    user && user.length <= MAX_USER_ID_LENGTH && /^[a-z0-9-_]+$/.test(user)
  );
}

export function getAvatarHaloTypeFromUser(userObj = {}) {
  if (userObj.isCivicLikerTrial || userObj.isSubscribedCivicLiker) {
    return 'civic-liker';
  }
  return 'none';
}
