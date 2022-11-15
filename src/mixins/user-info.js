import { mapGetters } from 'vuex';

import { getIdenticonAvatar } from '~/util/api';
import { ellipsis } from '~/util/ui';

export const createUserInfoMixin = ({ propKey = 'User' } = {}) => {
  const getPropName = propNameTemplate => {
    const propName = propNameTemplate.replace('{key}', propKey);
    return `${propName.charAt(0).toLocaleLowerCase()}${propName.substring(1)}`;
  };
  const userInfoPropName = getPropName('{key}Info');
  return {
    computed: {
      ...mapGetters(['getUserInfoByAddress']),
      [userInfoPropName]() {
        return this.getUserInfoByAddress(this.wallet);
      },
      [getPropName('{key}Avatar')]() {
        return (
          this[userInfoPropName]?.avatar || getIdenticonAvatar(this.wallet)
        );
      },
      [getPropName('is{key}CivicLiker')]() {
        return !!(
          this[userInfoPropName]?.isCivicLikerTrial ||
          this[userInfoPropName]?.isSubscribedCivicLiker
        );
      },
      [getPropName('{key}DisplayName')]() {
        return ellipsis(this[userInfoPropName]?.displayName || this.wallet);
      },
      [getPropName('{key}Description')]() {
        return this[userInfoPropName]?.description;
      },
    },
  };
};

export default createUserInfoMixin();
