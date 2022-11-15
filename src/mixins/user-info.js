import { mapGetters } from 'vuex';

import { getIdenticonAvatar } from '~/util/api';
import { ellipsis } from '~/util/ui';

export const createUserInfoMixin = ({ propKey = 'User' } = {}) => {
  const getPropName = (label, prefix = '') => {
    const propName = `${prefix}${propKey}${label}`;
    return `${propName.charAt(0).toLocaleLowerCase()}${propName.substring(1)}`;
  };
  const userInfoPropName = getPropName('Info');
  return {
    computed: {
      ...mapGetters(['getUserInfoByAddress']),
      [userInfoPropName]() {
        return this.getUserInfoByAddress(this.wallet);
      },
      [getPropName('Avatar')]() {
        return (
          this[userInfoPropName]?.avatar || getIdenticonAvatar(this.wallet)
        );
      },
      [getPropName('CivicLiker', 'is')]() {
        return !!(
          this[userInfoPropName]?.isCivicLikerTrial ||
          this[userInfoPropName]?.isSubscribedCivicLiker
        );
      },
      [getPropName('DisplayName')]() {
        return ellipsis(this[userInfoPropName]?.displayName || this.wallet);
      },
      [getPropName('Description')]() {
        return this[userInfoPropName]?.description;
      },
    },
  };
};

export default createUserInfoMixin();
