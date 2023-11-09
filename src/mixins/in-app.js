import { mapActions, mapGetters } from 'vuex';

import { checkIsLikeCoinAppInAppBrowser } from '~/util/client';

export default {
  computed: {
    ...mapGetters(['walletHasLoggedIn']),
    isInInAppBrowser() {
      return checkIsLikeCoinAppInAppBrowser(this.$route);
    },
  },
  methods: {
    ...mapActions(['openConnectWalletModal', 'initWalletAndLogin']),
  },
};
